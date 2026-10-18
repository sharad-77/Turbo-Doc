import { queryKeys } from '@/api/query-keys';
import type { DashboardStats } from '@/api/types';
import { API_ENDPOINTS } from '@/constants';
import apiClient from '@/lib/api-client';
import { useQuery } from '@tanstack/react-query';

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await apiClient.get<DashboardStats>(API_ENDPOINTS.DASHBOARD.STATS);
  return response.data;
};

export function useDashboardStatsQuery() {
  return useQuery<DashboardStats>({
    queryKey: queryKeys.dashboard.stats(),
    queryFn: getDashboardStats,
  });
}
