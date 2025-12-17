import { useMutation } from '@tanstack/react-query';
import { getUploadPresignedUrl, uploadFileToS3 } from '../upload';

interface UploadFileParams {
  file: File;
  folder?: string;
}

interface UploadResult {
  objectKey: string;
  url: string;
}

/**
 * Hook for uploading files to S3
 */
export const useFileUpload = () => {
  return useMutation<UploadResult, Error, UploadFileParams>({
    mutationFn: async ({ file, folder = 'temporary' }) => {
      // Get presigned URL
      const { url, objectKey } = await getUploadPresignedUrl(
        folder,
        file.type,
        file.name
      );

      // Upload file to S3
      await uploadFileToS3(url, file);

      return { url, objectKey };
    },
  });
};

