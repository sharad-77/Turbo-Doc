import type { DownloadUrlResponse, PresignedUrlResponse } from '@/api/types';
import { API_ENDPOINTS } from '@/constants';
import apiClient from '@/lib/api-client';
import { logger } from '@/lib/logger';
import { useMutation } from '@tanstack/react-query';

export const getUploadPresignedUrl = async (
  folder: string,
  mimeType: string,
  fileName: string
): Promise<PresignedUrlResponse> => {
  const response = await apiClient.post<PresignedUrlResponse>(
    API_ENDPOINTS.STORAGE.PRESIGNED_UPLOAD,
    {
      folder,
      mime: mimeType,
      fileName,
    }
  );
  return response.data;
};

export const getDownloadPresignedUrl = async (
  objectKey: string
): Promise<DownloadUrlResponse> => {
  const response = await apiClient.post<DownloadUrlResponse>(
    API_ENDPOINTS.STORAGE.PRESIGNED_DOWNLOAD,
    {
      objectKey,
    }
  );
  return response.data;
};

export const uploadFileToS3 = async (presignedUrl: string, file: File): Promise<void> => {
  await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });
};

export const downloadFileFromS3 = async (objectKey: string, fileName: string): Promise<void> => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.STORAGE.DOWNLOAD(objectKey), {
      responseType: 'blob',
    });

    const blob =
      response.data instanceof Blob
        ? response.data
        : new Blob([response.data], {
            type: response.headers['content-type'] || 'application/octet-stream',
          });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 100);
  } catch (error) {
    logger.error('Download error:', error);
    throw error;
  }
};

export function useUploadFileMutation() {
  return useMutation({
    mutationFn: async ({
      folder,
      file,
    }: {
      folder: 'documents' | 'images' | 'temporary' | string;
      file: File;
    }) => {
      const presigned = await getUploadPresignedUrl(folder, file.type, file.name);
      await uploadFileToS3(presigned.url, file);
      return {
        key: presigned.objectKey,
        objectKey: presigned.objectKey,
        file,
      };
    },
  });
}
