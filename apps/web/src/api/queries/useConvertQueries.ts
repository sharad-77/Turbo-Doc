import { queryKeys } from '@/api/query-keys';
import type { JobResponse } from '@/api/types';
import { API_ENDPOINTS } from '@/constants';
import apiClient from '@/lib/api-client';
import { useQuery } from '@tanstack/react-query';

export const getJobStatus = async (jobId: string): Promise<JobResponse> => {
  const response = await apiClient.get<JobResponse>(API_ENDPOINTS.JOBS.STATUS(jobId));
  return response.data;
};

export function useConversionTypesQuery() {
  return useQuery({
    queryKey: queryKeys.convert.types(),
    queryFn: async () => {
      return [
        { label: 'PDF to Word (.docx)', value: 'pdf-to-docx', from: 'pdf', to: 'docx' },
        { label: 'Word to PDF', value: 'docx-to-pdf', from: 'docx', to: 'pdf' },
        { label: 'PDF to Text (.txt)', value: 'pdf-to-txt', from: 'pdf', to: 'txt' },
        { label: 'Text to PDF', value: 'txt-to-pdf', from: 'txt', to: 'pdf' },
        { label: 'Doc to PDF (.doc)', value: 'doc-to-pdf', from: 'doc', to: 'pdf' },
      ];
    },
    staleTime: Infinity,
  });
}

export function useJobStatusQuery(
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

  return useQuery<JobResponse>({
    queryKey: queryKeys.convert.job(jobId ?? undefined),
    queryFn: () => getJobStatus(jobId!),
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
