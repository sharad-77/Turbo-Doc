import apiClient from '@/lib/api-client';
import { logger } from '@/lib/logger';

export interface PresignedUrlResponse {
  url: string;
  objectKey: string;
}

export interface DownloadUrlResponse {
  url: string;
  objectKey: string;
}

/**
 * Get presigned URL for uploading a file to S3
 */
export const getUploadPresignedUrl = async (
  folder: string,
  mimeType: string,
  fileName: string
): Promise<PresignedUrlResponse> => {
  const response = await apiClient.post<PresignedUrlResponse>('/api/v1/get-presigned-url', {
    folder,
    mime: mimeType,
    fileName,
  });
  return response.data;
};

/**
 * Get presigned URL for downloading a file from S3
 */
export const getDownloadPresignedUrl = async (objectKey: string): Promise<DownloadUrlResponse> => {
  const response = await apiClient.post<DownloadUrlResponse>('/api/v1/get-download-url', {
    objectKey,
  });
  return response.data;
};

/**
 * Upload file directly to S3 using presigned URL
 */
export const uploadFileToS3 = async (presignedUrl: string, file: File): Promise<void> => {
  await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });
};

/**
 * Download file from S3 through backend proxy (avoids CORS issues)
 */
export const downloadFileFromS3 = async (objectKey: string, fileName: string): Promise<void> => {
  try {
    const response = await apiClient.get(
      `/api/v1/download?objectKey=${encodeURIComponent(objectKey)}`,
      {
        responseType: 'blob',
      }
    );

    // Axios returns blob data directly when responseType is 'blob'
    const blob =
      response.data instanceof Blob
        ? response.data
        : new Blob([response.data], {
            type: response.headers['content-type'] || 'application/octet-stream',
          });

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();

    // Cleanup
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 100);
  } catch (error) {
    logger.error('Download error:', error);
    throw error;
  }
};
