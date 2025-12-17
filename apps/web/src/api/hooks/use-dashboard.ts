import { useQuery } from '@tanstack/react-query';
import { getDashboardStats, type DashboardStats } from '../dashboard';

const DASHBOARD_QUERY_KEY = ['dashboard', 'stats'] as const;

/**
 * Hook to fetch dashboard statistics
 */
export const useDashboardStats = () => {
  return useQuery<DashboardStats, Error>({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: getDashboardStats,
    staleTime: 1000 * 60 * 2, // 2 minutes - dashboard stats don't change frequently
  });
};
