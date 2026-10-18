'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { env } from '@/config/env';
import {
  useCreatePlanOrderMutation,
  usePlansQuery,
  useUserPlanQuery,
  useVerifyPaymentMutation,
} from '@/api';

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export function usePayments() {
  const router = useRouter();
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: plans = [], isLoading: plansLoading } = usePlansQuery();
  const { data: userPlan, isLoading: userPlanLoading } = useUserPlanQuery();

  const createOrderMutation = useCreatePlanOrderMutation();
  const verifyPaymentMutation = useVerifyPaymentMutation();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleRazorpayPayment = async (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;

    if (plan.name === 'FREE') {
      toast.error('Free plan does not require payment');
      router.push('/signup');
      return;
    }

    setIsProcessing(true);

    try {
      const order = await createOrderMutation.mutateAsync(planId);

      const options = {
        key: env.razorpayKeyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Turbo-Doc',
        description: `${plan.displayName} Subscription`,
        order_id: order.id,
        handler: async function (response: RazorpayResponse) {
          try {
            const result = await verifyPaymentMutation.mutateAsync({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (result.status === 'SUCCESS') {
              window.location.reload();
            }
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: '',
          email: '',
        },
        theme: {
          color: '#3b82f6',
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            toast.info('Payment cancelled');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch {
      setIsProcessing(false);
    }
  };

  return {
    state: {
      plans,
      userPlan,
      selectedPlanId,
      isLoading: plansLoading || userPlanLoading,
      isProcessing: isProcessing || createOrderMutation.isPending || verifyPaymentMutation.isPending,
    },
    actions: {
      setSelectedPlanId,
      handleRazorpayPayment,
    },
  };
}
