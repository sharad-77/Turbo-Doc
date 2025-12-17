import apiClient from '@/lib/api-client';

export interface DashboardStats {
  todayConversions: number;
  growthPercentage: number;
  totalFiles: number;
  storageUsed: number; // in bytes
  weeklyGraph: Array<{
    name: string;
    conversions: number;
  }>;
}

/**
 * Fetch dashboard statistics
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await apiClient.get<DashboardStats>('/api/dashboard/stats');
  return response.data;
};

