import { queryKeys } from '@/api/query-keys';
import type { FileType } from '@/api/types';
import { API_ENDPOINTS, SUCCESS_MESSAGES } from '@/constants';
import apiClient from '@/lib/api-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { downloadFileFromS3 } from './useUploadMutations';

export const deleteFileByType = async (type: 'document' | 'image' | string, id: string): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.FILES.BY_TYPE(type, id));
};

export const deleteFile = (id: string, type: 'document' | 'image'): Promise<void> =>
  deleteFileByType(type, id);

export interface DeleteFilePayload {
  type?: FileType;
  id?: string;
  fileType?: FileType;
  fileId?: string;
}

export function useDeleteFileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DeleteFilePayload) => {
      const type = (data.type || data.fileType || 'document') as FileType;
      const id = (data.id || data.fileId || '') as string;
      return deleteFileByType(type, id);
    },
    meta: {
      successMessage: SUCCESS_MESSAGES.FILE_DELETED,
      invalidates: [queryKeys.files.all, queryKeys.dashboard.stats()],
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.files.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats() });
    },
  });
}

export function useDownloadFileMutation() {
  return useMutation({
    mutationFn: ({ objectKey, fileName }: { objectKey: string; fileName: string }) =>
      downloadFileFromS3(objectKey, fileName),
  });
}
