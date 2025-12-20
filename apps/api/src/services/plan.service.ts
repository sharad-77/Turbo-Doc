import { prisma } from '@repo/database';

/**
 * Get all active subscription plans
 */
export const getPlansService = async () => {
  const plans = await prisma.subscriptionPlan.findMany({
    where: { isActive: true },
    orderBy: { price: 'asc' },
    select: {
      id: true,
      name: true,
      displayName: true,
      price: true,
      currency: true,
      dailyDocumentLimit: true,
      dailyImageLimit: true,
      mergeFileLimit: true,
      storageLimitMB: true,
      retentionDays: true,
      description: true,
      features: true,
    },
  });

  return plans;
};

/**
 * Get a specific plan by name (FREE or PRO)
 */
export const getPlanByNameService = async (name: string) => {
  const plan = await prisma.subscriptionPlan.findUnique({
    where: { name: name.toUpperCase() },
    select: {
      id: true,
      name: true,
      displayName: true,
      price: true,
      currency: true,
      dailyDocumentLimit: true,
      dailyImageLimit: true,
      mergeFileLimit: true,
      storageLimitMB: true,
      retentionDays: true,
      description: true,
      features: true,
    },
  });

  if (!plan) {
    throw new Error(`Plan ${name} not found`);
  }

  return plan;
};

/**
 * Get user's current plan with full details
 * For guests (not logged in), returns guest limits
 * For authenticated users, returns their plan (FREE or PRO)
 */
export const getUserPlanService = async (userId: string | null, userPlan: string) => {
  if (!userId) {
    return {
      name: 'GUEST',
      displayName: 'Guest',
      price: 0,
      currency: 'INR',
      dailyDocumentLimit: 1,
      dailyImageLimit: 1,
      mergeFileLimit: 1,
      storageLimitMB: 0,
      retentionDays: 1,
      description: 'Limited guest access',
      features: [
        '1 document conversion/day',
        '1 image conversion/day',
        '1 file merge/day',
        'No storage',
        '1-day retention',
      ],
    };
  }

  if (!userPlan || userPlan === 'GUEST') {
    userPlan = 'FREE';
  }

  const plan = await prisma.subscriptionPlan.findUnique({
    where: { name: userPlan },
    select: {
      id: true,
      name: true,
      displayName: true,
      price: true,
      currency: true,
      dailyDocumentLimit: true,
      dailyImageLimit: true,
      mergeFileLimit: true,
      storageLimitMB: true,
      retentionDays: true,
      description: true,
      features: true,
    },
  });

  if (!plan) {
    return getPlanByNameService('FREE');
  }

  return plan;
};

/**
 * Get plan limits by plan name (used by middleware)
 */
export const getPlanLimitsService = async (planName: string) => {
  if (planName === 'GUEST') {
    return {
      dailyDocumentLimit: 1,
      dailyImageLimit: 1,
      mergeFileLimit: 1,
      storageLimitMB: 0,
    };
  }

  const plan = await prisma.subscriptionPlan.findUnique({
    where: { name: planName },
    select: {
      dailyDocumentLimit: true,
      dailyImageLimit: true,
      mergeFileLimit: true,
      storageLimitMB: true,
    },
  });

  if (!plan) {
    throw new Error(`Plan ${planName} not found`);
  }

  return plan;
};
