export interface SubscriptionPlan {
  id: string;
  name: string;
  displayName: string;
  price: string;
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

export interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentResponse {
  status: string;
  message: string;
}
