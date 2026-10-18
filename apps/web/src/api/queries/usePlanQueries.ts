import { queryKeys } from '@/api/query-keys';
import type { SubscriptionPlan } from '@/api/types';
import { API_ENDPOINTS } from '@/constants';
import apiClient from '@/lib/api-client';
import { useQuery } from '@tanstack/react-query';

export const getPlans = async (): Promise<SubscriptionPlan[]> => {
  const response = await apiClient.get<SubscriptionPlan[]>(API_ENDPOINTS.PLANS.LIST);
  return response.data;
};

export const getPlanByName = async (name: string): Promise<SubscriptionPlan> => {
  const response = await apiClient.get<SubscriptionPlan>(API_ENDPOINTS.PLANS.BY_NAME(name));
  return response.data;
};

export const getUserPlan = async (): Promise<SubscriptionPlan> => {
  const response = await apiClient.get<SubscriptionPlan>(API_ENDPOINTS.PLANS.USER_PLAN);
  return response.data;
};

export function usePlansQuery() {
  return useQuery<SubscriptionPlan[]>({
    queryKey: queryKeys.plans.list(),
    queryFn: getPlans,
  });
}

export function usePlanByNameQuery(name: string, options?: { enabled?: boolean }) {
  return useQuery<SubscriptionPlan>({
    queryKey: queryKeys.plans.byName(name),
    queryFn: () => getPlanByName(name),
    enabled: Boolean(name) && (options?.enabled ?? true),
  });
}

export function useUserPlanQuery() {
  return useQuery<SubscriptionPlan>({
    queryKey: queryKeys.plans.userPlan(),
    queryFn: getUserPlan,
  });
}
