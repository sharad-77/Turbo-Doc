'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePlansQuery } from '@/api';

export const STATIC_PLANS = [
  {
    id: 'free',
    name: 'Free Plan',
    price: { monthly: 0, yearly: 0 },
    description: 'Perfect for trying out Turbo-Doc with basic needs.',
    features: [
      '5 document conversions/day',
      '5 image conversions/day',
      '2 file merges/day',
      '200MB storage',
      '7-day retention',
    ],
    highlight: false,
    buttonText: 'Get Started Free',
  },
  {
    id: 'pro',
    name: 'Pro Plan',
    price: { monthly: 249, yearly: 199 },
    description: 'For professionals who need more power and speed.',
    features: [
      '20 document conversions/day',
      '20 image conversions/day',
      'Unlimited file merges',
      '500MB storage',
      '30-day retention',
      'Priority Support',
      'No Watermarks',
    ],
    highlight: true,
    buttonText: 'Upgrade to Pro',
  },
];

export const COMPARISON_DATA = [
  {
    category: 'Usage Limits',
    features: [
      { name: 'Daily Documents', free: '5', pro: '20' },
      { name: 'Daily Images', free: '5', pro: '20' },
      { name: 'File Merges', free: '2/day', pro: 'Unlimited' },
    ],
  },
  {
    category: 'Storage',
    features: [
      { name: 'Max Storage', free: '200MB', pro: '500MB' },
      { name: 'File Retention', free: '7 Days', pro: '30 Days' },
    ],
  },
  {
    category: 'Professional Tools',
    features: [
      { name: 'Priority Support', free: false, pro: true },
      { name: 'No Watermarks', free: false, pro: true },
      { name: 'Batch Processing', free: false, pro: true },
    ],
  },
];

export function usePricing() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const { data: plans = [], isLoading } = usePlansQuery();

  const handlePlanAction = (planId: string) => {
    const route =
      planId === 'free' ? '/signup' : `/payments?planId=${planId}&cycle=${billingCycle}`;
    router.push(route);
  };

  return {
    state: {
      billingCycle,
      plans,
      staticPlans: STATIC_PLANS,
      comparisonData: COMPARISON_DATA,
      isLoading,
    },
    actions: {
      setBillingCycle,
      handlePlanAction,
    },
  };
}
