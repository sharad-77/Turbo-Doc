import { queryKeys } from '@/api/query-keys';
import type {
  ConvertDocumentRequest,
  JobResponse,
  MergePdfRequest,
  SplitPdfRequest,
} from '@/api/types';
import { API_ENDPOINTS } from '@/constants';
import apiClient from '@/lib/api-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const convertDocument = async (data: ConvertDocumentRequest): Promise<JobResponse> => {
  const response = await apiClient.post<JobResponse>(API_ENDPOINTS.DOCUMENTS.CONVERT, data);
  return response.data;
};

export const mergePdfs = async (data: MergePdfRequest): Promise<JobResponse> => {
  const response = await apiClient.post<JobResponse>(API_ENDPOINTS.DOCUMENTS.MERGE_PDF, data);
  return response.data;
};

export const splitPdf = async (data: SplitPdfRequest): Promise<JobResponse> => {
  const response = await apiClient.post<JobResponse>(API_ENDPOINTS.DOCUMENTS.SPLIT_PDF, data);
  return response.data;
};

export function useConvertFileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ConvertDocumentRequest) => convertDocument(data),
    onSuccess: (data: JobResponse) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.files.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats() });
      if (data.jobId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.convert.job(data.jobId) });
      }
    },
  });
}

export function useMergePdfsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MergePdfRequest) => mergePdfs(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.files.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats() });
    },
  });
}

export function useSplitPdfMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SplitPdfRequest) => splitPdf(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.files.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats() });
    },
  });
}
