import { queryKeys } from '@/api/query-keys';
import type { UserProfile } from '@/api/types';
import { API_ENDPOINTS } from '@/constants';
import apiClient from '@/lib/api-client';
import { useQuery } from '@tanstack/react-query';

export const getProfile = async (): Promise<UserProfile> => {
  const response = await apiClient.get<UserProfile>(API_ENDPOINTS.PROFILE.ME);
  return response.data;
};

export function useProfileQuery() {
  return useQuery<UserProfile>({
    queryKey: queryKeys.profile.me(),
    queryFn: getProfile,
  });
}
