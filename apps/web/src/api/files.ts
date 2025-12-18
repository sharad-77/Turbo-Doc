import apiClient from '@/lib/api-client';

// Add to existing files.ts or create new file
export interface FileItem {
  id: string;
  name: string; // Backend returns "name", not "fileName"
  size: number; // Backend returns "size", not "fileSize"
  type: 'document' | 'image';
  format: string;
  status: string;
  createdAt: string;
  processedS3Key?: string;
  downloadUrl?: string;
}

/**
 * Get all user files (documents + images) sorted by most recent
 */
export const getRecentFiles = async (limit?: number): Promise<FileItem[]> => {
  const response = await apiClient.get<FileItem[]>('/api/v1/files');
  const files = response.data;

  // Sort by createdAt descending (most recent first)
  const sortedFiles = files.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Return limited number if specified
  return limit ? sortedFiles.slice(0, limit) : sortedFiles;
};

/**
 * Delete a file
 */
export const deleteFile = async (type: 'document' | 'image', id: string): Promise<void> => {
  await apiClient.delete(`/api/v1/files/${type}/${id}`);
};
