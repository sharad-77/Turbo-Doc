import apiClient from '@/lib/api-client';

export interface ConvertImageRequest {
  key: string; // S3 key of uploaded file (without temporary/ prefix)
  format: 'jpeg' | 'jpg' | 'webp' | 'avif' | 'png' | 'gif';
  originalFileName: string;
  originalFormat: string;
  fileSize: number;
  width?: number;
  height?: number;
}

export interface CompressImageRequest {
  key: string;
  quality: number; // 1-100
  originalFileName: string;
  originalFormat: string;
  fileSize: number;
  width?: number;
  height?: number;
}

export interface ResizeImageRequest {
  key: string;
  scalePercent: number; // 25-200
  originalFileName: string;
  originalFormat: string;
  fileSize: number;
  width?: number;
  height?: number;
}

export interface ImageJobResponse {
  jobId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  result?: {
    key?: string;
    width?: number;
    height?: number;
    size?: number;
  };
  error?: string;
  downloadUrl?: string;
  processedFileKey?: string;
}

/**
 * Convert image format
 */
export const convertImage = async (data: ConvertImageRequest): Promise<ImageJobResponse> => {
  const response = await apiClient.post<ImageJobResponse>('/api/v1/images/convert', data);
  return response.data;
};

/**
 * Compress image
 */
export const compressImage = async (data: CompressImageRequest): Promise<ImageJobResponse> => {
  const response = await apiClient.post<ImageJobResponse>('/api/v1/images/compress', data);
  return response.data;
};

/**
 * Resize image
 */
export const resizeImage = async (data: ResizeImageRequest): Promise<ImageJobResponse> => {
  const response = await apiClient.post<ImageJobResponse>('/api/v1/images/resize', data);
  return response.data;
};

/**
 * Get image job status
 */
export const getImageJobStatus = async (jobId: string): Promise<ImageJobResponse> => {
  const response = await apiClient.get<ImageJobResponse>(`/api/jobs/${jobId}`);
  return response.data;
};

