export type JobStatus = 'queued' | 'processing' | 'completed' | 'failed';

export interface JobResult {
  s3Key?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface Job {
  jobId: string;
  type: 'doc' | 'image';
  task: string; // e.g., 'convert', 'merge', 'split', 'resize'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  status: JobStatus;
  result?: JobResult;
  error?: string;
  createdAt: Date;
}

export interface WorkerMessage {
  jobId: string;
  status?: JobStatus;
  result?: JobResult;
  error?: string;
  message?: string;
}
