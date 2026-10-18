import { queryKeys } from '@/api/query-keys';
import type { FileItem, UserFile } from '@/api/types';
import { API_ENDPOINTS } from '@/constants';
import apiClient from '@/lib/api-client';
import { useQuery } from '@tanstack/react-query';

export const getRecentFiles = async (limit?: number): Promise<FileItem[]> => {
  const response = await apiClient.get<FileItem[]>(API_ENDPOINTS.FILES.LIST);
  const files = response.data;

  // Sort by createdAt descending (most recent first)
  const sortedFiles = files.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return limit ? sortedFiles.slice(0, limit) : sortedFiles;
};

export const getFiles = async (): Promise<UserFile[]> => {
  const response = await apiClient.get(API_ENDPOINTS.FILES.LIST);
  return response.data;
};

export function useFilesQuery(limit?: number) {
  return useQuery<FileItem[]>({
    queryKey: queryKeys.files.list(limit),
    queryFn: () => getRecentFiles(limit),
  });
}
