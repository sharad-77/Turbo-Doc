import { queryKeys } from '@/api/query-keys';
import type { ImageJobResponse } from '@/api/types';
import { API_ENDPOINTS } from '@/constants';
import apiClient from '@/lib/api-client';
import { useQuery } from '@tanstack/react-query';

export const getImageJobStatus = async (jobId: string): Promise<ImageJobResponse> => {
  const response = await apiClient.get<ImageJobResponse>(API_ENDPOINTS.JOBS.STATUS(jobId));
  return response.data;
};

export function useImageJobStatusQuery(
  jobIdOrOptions?: string | null | { jobId?: string | null; enabled?: boolean },
  enabledParam = true
) {
  const jobId =
    typeof jobIdOrOptions === 'object' && jobIdOrOptions !== null
      ? jobIdOrOptions.jobId
      : jobIdOrOptions;
  const enabled =
    typeof jobIdOrOptions === 'object' && jobIdOrOptions !== null
      ? (jobIdOrOptions.enabled ?? true)
      : enabledParam;

  return useQuery<ImageJobResponse>({
    queryKey: queryKeys.images.job(jobId ?? undefined),
    queryFn: () => getImageJobStatus(jobId!),
    enabled: Boolean(jobId) && enabled,
    refetchInterval: query => {
      const status = query.state.data?.status;
      return status === 'completed' || status === 'failed' ? false : 2000;
    },
    meta: {
      ignoreGlobalLoader: true,
    },
  });
}
