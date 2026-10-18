import { queryKeys } from '@/api/query-keys';
import type {
  CompressImageRequest,
  ConvertImageRequest,
  ImageJobResponse,
  ResizeImageRequest,
} from '@/api/types';
import { API_ENDPOINTS } from '@/constants';
import apiClient from '@/lib/api-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const convertImage = async (data: ConvertImageRequest): Promise<ImageJobResponse> => {
  const response = await apiClient.post<ImageJobResponse>(API_ENDPOINTS.IMAGES.CONVERT, data);
  return response.data;
};

export const compressImage = async (data: CompressImageRequest): Promise<ImageJobResponse> => {
  const response = await apiClient.post<ImageJobResponse>(API_ENDPOINTS.IMAGES.COMPRESS, data);
  return response.data;
};

export const resizeImage = async (data: ResizeImageRequest): Promise<ImageJobResponse> => {
  const response = await apiClient.post<ImageJobResponse>(API_ENDPOINTS.IMAGES.RESIZE, data);
  return response.data;
};

export function useProcessImageMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ConvertImageRequest) => convertImage(data),
    onSuccess: (data: ImageJobResponse) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.files.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats() });
      if (data.jobId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.images.job(data.jobId) });
      }
    },
  });
}

export function useCompressImageMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CompressImageRequest) => compressImage(data),
    onSuccess: (data: ImageJobResponse) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.files.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats() });
      if (data.jobId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.images.job(data.jobId) });
      }
    },
  });
}

export function useResizeImageMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ResizeImageRequest) => resizeImage(data),
    onSuccess: (data: ImageJobResponse) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.files.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats() });
      if (data.jobId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.images.job(data.jobId) });
      }
    },
  });
}
