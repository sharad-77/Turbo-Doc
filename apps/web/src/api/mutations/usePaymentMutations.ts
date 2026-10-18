import { queryKeys } from '@/api/query-keys';
import type {
  CreateOrderRequest,
  CreateOrderResponse,
  VerifyPaymentRequest,
  VerifyPaymentResponse,
} from '@/api/types';
import { API_ENDPOINTS, SUCCESS_MESSAGES } from '@/constants';
import apiClient from '@/lib/api-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const createPlanOrder = async (planId: string): Promise<CreateOrderResponse> => {
  const response = await apiClient.post<CreateOrderResponse>(API_ENDPOINTS.PAYMENTS.CREATE_ORDER, {
    planId,
  });
  return response.data;
};

export const verifyPayment = async (
  paymentData: VerifyPaymentRequest
): Promise<VerifyPaymentResponse> => {
  const response = await apiClient.post<VerifyPaymentResponse>(
    API_ENDPOINTS.PAYMENTS.VERIFY,
    paymentData
  );
  return response.data;
};

export function useCreatePlanOrderMutation() {
  return useMutation({
    mutationFn: (data: string | CreateOrderRequest): Promise<CreateOrderResponse> => {
      const planId = typeof data === 'string' ? data : data.planId;
      return createPlanOrder(planId);
    },
  });
}

export function useVerifyPaymentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VerifyPaymentRequest) => verifyPayment(data),
    meta: {
      successMessage: SUCCESS_MESSAGES.PAYMENT_VERIFIED,
      invalidates: [queryKeys.plans.userPlan(), queryKeys.profile.me()],
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.plans.userPlan() });
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.me() });
    },
  });
}
