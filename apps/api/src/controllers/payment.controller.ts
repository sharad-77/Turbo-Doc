import { prisma } from '@repo/database';
import crypto from 'crypto';
import { Request, Response } from 'express';
import Razorpay from 'razorpay';

interface OrderRequest extends Request {
  userId?: string;
  planId?: string;
}

// Lazy initialization to prevent crash before environment validation
let razorpayInstance: Razorpay | null = null;
const getRazorpay = () => {
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: process.env.TEST_API_KEY!,
      key_secret: process.env.TEST_API_SECRET!,
    });
  }
  return razorpayInstance;
};


export const createOrder = async (req: OrderRequest, res: Response) => {
  try {
    const { planId } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: User ID is required' });
    }

    // Fetch plan from database
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
      select: {
        id: true,
        name: true,
        price: true,
        currency: true,
      },
    });

    if (!plan) return res.status(404).json({ error: 'Plan Not Found' });

    const TodaysDate = Date.now();

    const options = {
      amount: Number(plan.price) * 100, // Convert to paise for INR
      currency: plan.currency,
      receipt: `rcpt_${TodaysDate}`,
      notes: { userId, planId },
    };

    const order = await getRazorpay().orders.create(options);

    await prisma.payment.create({
      data: {
        userId,
        amount: plan.price,
        currency: plan.currency,
        provider: 'RAZORPAY',
        providerOrderId: order.id,
        status: 'PENDING',
        metadata: { planId },
      },
    });

    res.json(order);
  } catch (error) {
    const err = error as Error;
    console.error(err);
    res.status(500).json({ errror: 'Error While Creating Order', message: err.message });
  }
};

const fulfillOrder = async (orderId: string, paymentId: string, userId: string, planId: string) => {
  try {
    await prisma.$transaction(async tx => {
      // 1. Idempotency Check: Prevent duplicate processing
      const existingPayment = await tx.payment.findFirst({
        where: { providerOrderId: orderId },
      });

      if (existingPayment && existingPayment.status === 'SUCCESS') {
        console.log(`Order ${orderId} already processed. Skipping.`);
        return;
      }

      // 2. Update Payment Status
      await tx.payment.updateMany({
        where: { providerOrderId: orderId },
        data: {
          status: 'SUCCESS',
          providerPaymentId: paymentId,
        },
      });

      // 3. Calculate Subscription Dates
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);

      // 4. Create or Update Subscription
      await tx.subscription.upsert({
        where: { userId: userId },
        update: {
          status: 'ACTIVE',
          planId: planId,
          startDate: startDate,
          endDate: endDate,
          providerSubscriptionId: paymentId,
        },
        create: {
          userId: userId,
          planId: planId,
          status: 'ACTIVE',
          provider: 'RAZORPAY',
          startDate: startDate,
          endDate: endDate,
          providerSubscriptionId: paymentId,
        },
      });

      // 5. Update User Plan
      await tx.user.update({
        where: { id: userId },
        data: { plan: 'PRO' },
      });
    });
  } catch (error) {
    console.error(`Transaction failed for order ${orderId}:`, error);
    throw error; // Re-throw to ensure caller knows it failed
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const secret = process.env.TEST_API_SECRET!; // Use the Key Secret, not Webhook Secret for client-side verification

  const generated_signature = crypto
    .createHmac('sha256', secret)
    .update(razorpay_order_id + '|' + razorpay_payment_id)
    .digest('hex');

  if (generated_signature !== razorpay_signature) {
    return res.status(400).json({ error: 'Invalid Payment Signature' });
  }

  // Retrieve metadata from the order or payment record
  const paymentRecord = await prisma.payment.findFirst({
    where: { providerOrderId: razorpay_order_id },
  });

  if (!paymentRecord) {
    return res.status(404).json({ error: 'Payment Order Not Found' });
  }

  // Assuming metadata is stored as Json and has planId.
  const planId = (paymentRecord.metadata as { planId?: string })?.planId;
  const userId = paymentRecord.userId;

  if (!planId) {
    return res.status(400).json({ error: 'Invalid payment metadata: planId missing' });
  }

  try {
    await fulfillOrder(razorpay_order_id, razorpay_payment_id, userId, planId);
    res.json({ status: 'success', message: 'Payment verified and processed' });
  } catch (error) {
    console.error('Verification logic failed:', error);
    res.status(500).json({ error: 'Internal Processing Error' });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  const secret = process.env.TEST_API_WEBHOOK_SECRET!;
  const signature = req.headers['x-razorpay-signature'] as string;

  const shasum = crypto.createHmac('sha256', secret);
  // eslint-disable-next-line
  shasum.update((req as any).rawBody);
  const digest = shasum.digest('hex');

  if (digest !== signature) {
    return res.status(400).json({ status: 'invalid_signature' });
  }

  const event = JSON.parse((req as Request & { rawBody: string }).rawBody);
  const eventId = event.payload.payment?.entity?.id || event.payload.order?.entity?.id;

  try {
    const existingEvent = await prisma.webhookEvent.findUnique({
      where: { eventId: eventId },
    });

    if (existingEvent && existingEvent.processed) {
      return res.json({ status: 'already_processed' });
    }

    await prisma.webhookEvent.create({
      data: {
        provider: 'RAZORPAY',
        eventType: event.event,
        eventId: eventId,
        // eslint-disable-next-line
        payload: event as any,
        processed: true,
      },
    });

    if (event.event === 'payment.captured') {
      const paymentEntity = event.payload.payment.entity;
      const orderId = paymentEntity.order_id;
      const { planId, userId } = paymentEntity.notes;

      await fulfillOrder(orderId, paymentEntity.id, userId, planId);
    }
    res.json({ status: 'OK' });
  } catch (error) {
    console.error('WebHook Error', error);
    res.json({ status: 'error_handled' });
  }
};
