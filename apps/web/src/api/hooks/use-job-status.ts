import { useQuery } from '@tanstack/react-query';
import { getJobStatus } from '../documents';
import { getImageJobStatus } from '../images';

interface UseJobStatusParams {
  jobId: string;
  type: 'document' | 'image';
  enabled?: boolean;
}

/**
 * Hook to poll job status
 */
export const useJobStatus = ({ jobId, type, enabled = true }: UseJobStatusParams) => {
  return useQuery({
    queryKey: ['job-status', type, jobId],
    queryFn: () => {
      if (type === 'document') {
        return getJobStatus(jobId);
      }
      return getImageJobStatus(jobId);
    },
    enabled: enabled && !!jobId,
    refetchInterval: (query) => {
      const data = query.state.data;
      // Poll every 2 seconds if job is still processing
      if (data?.status === 'queued' || data?.status === 'processing') {
        return 2000;
      }
      // Stop polling if completed or failed
      return false;
    },
    retry: false,
  });
};

