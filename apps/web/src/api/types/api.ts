export type JobStatus = 'queued' | 'processing' | 'completed' | 'failed';

export interface BaseJobResult {
  s3Key?: string;
  key?: string;
  size?: number;
  width?: number;
  height?: number;
}

export interface JobResponse {
  jobId: string;
  status: JobStatus;
  result?: BaseJobResult;
  error?: string;
  downloadUrl?: string;
  processedFileKey?: string;
}

export interface ImageJobResponse {
  jobId: string;
  status: JobStatus;
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

export interface PresignedUrlResponse {
  url: string;
  objectKey: string;
}

export interface DownloadUrlResponse {
  url: string;
  objectKey: string;
}

export interface ApiErrorResponse {
  message: string;
  status?: number;
  data?: unknown;
  isLimitError?: boolean;
}
