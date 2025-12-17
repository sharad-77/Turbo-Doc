import apiClient from '@/lib/api-client';

// Types
export interface SubscriptionPlan {
  id: string;
  name: string;
  displayName: string;
  price: string; // Decimal as string
  currency: string;
  dailyDocumentLimit: number;
  dailyImageLimit: number;
  mergeFileLimit: number; // -1 for unlimited
  storageLimitMB: number;
  retentionDays: number;
  description?: string;
  features?: string[];
}

export interface CreateOrderRequest {
  planId: string;
}

export interface CreateOrderResponse {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
}

/**
 * Get all available subscription plans
 */
export const getPlans = async (): Promise<SubscriptionPlan[]> => {
  const response = await apiClient.get('/api/v1/plans');
  return response.data;
};

/**
 * Get a specific plan by name (FREE or PRO)
 */
export const getPlanByName = async (name: string): Promise<SubscriptionPlan> => {
  const response = await apiClient.get(`/api/v1/plans/${name}`);
  return response.data;
};

/**
 * Get current user's plan details
 */
export const getUserPlan = async (): Promise<SubscriptionPlan> => {
  const response = await apiClient.get('/api/v1/user/plan');
  return response.data;
};

/**
 * Create Razorpay order for plan purchase
 */
export const createPlanOrder = async (planId: string): Promise<CreateOrderResponse> => {
  const response = await apiClient.post('/api/v1/payments/create-order', { planId });
  return response.data;
};

/**
 * Verify Razorpay payment
 */
export const verifyPayment = async (paymentData: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): Promise<{ status: string; message: string }> => {
  const response = await apiClient.post('/api/v1/payments/verify', paymentData);
  return response.data;
};
