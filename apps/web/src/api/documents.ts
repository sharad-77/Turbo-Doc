import apiClient from '@/lib/api-client';

export interface ConvertDocumentRequest {
  key: string; // S3 key of uploaded file (without temporary/ prefix)
  targetFormat: 'pdf' | 'docx' | 'txt' | 'doc';
  originalFileName: string;
  originalFormat: string;
  fileSize: number;
}

export interface MergePdfRequest {
  keys: string[]; // Array of S3 keys
  originalFileName: string;
  originalFormat: string;
  fileSize: number;
}

export interface SplitPdfRequest {
  key: string;
  startPage: number;
  endPage: number;
  originalFileName: string;
  fileSize: number;
}

export interface JobResponse {
  jobId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  result?: {
    s3Key?: string;
    key?: string;
    size?: number;
  };
  error?: string;
  downloadUrl?: string;
  processedFileKey?: string;
}

/**
 * Convert document to target format
 */
export const convertDocument = async (
  data: ConvertDocumentRequest
): Promise<JobResponse> => {
  const response = await apiClient.post<JobResponse>('/api/v1/documents/convert', data);
  return response.data;
};

/**
 * Merge multiple PDFs
 */
export const mergePdfs = async (data: MergePdfRequest): Promise<JobResponse> => {
  const response = await apiClient.post<JobResponse>('/api/v1/documents/merge-pdf', data);
  return response.data;
};

/**
 * Split PDF into pages
 */
export const splitPdf = async (data: SplitPdfRequest): Promise<JobResponse> => {
  const response = await apiClient.post<JobResponse>('/api/v1/documents/split-pdf', data);
  return response.data;
};

/**
 * Get job status
 */
export const getJobStatus = async (jobId: string): Promise<JobResponse> => {
  const response = await apiClient.get<JobResponse>(`/api/jobs/${jobId}`);
  return response.data;
};

