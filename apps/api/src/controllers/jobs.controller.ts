import { createDownloadPresignedUrl } from '@repo/file-upload';
import { Request, Response } from 'express';
import { workerService } from '../services/worker.service.js';

const awsBucketName = process.env.AWS_BUCKET_NAME;

export const getJobStatusController = async (req: Request, res: Response) => {
  const { jobId } = req.params;

  if (!jobId) {
    return res.status(400).json({ error: 'Job ID is required' });
  }

  const job = await workerService.getJobStatus(jobId);

  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  let downloadUrl: string | null = null;
  let processedFileKey: string | null = null;

  // If job is completed and has a result with s3Key, generate presigned URL
  if (job.status === 'completed' && job.result) {
    const result = job.result as { s3Key?: string; key?: string; outputKey?: string };
    processedFileKey = result.s3Key || result.outputKey || result.key || null;

    if (processedFileKey && awsBucketName) {
      try {
        downloadUrl = await createDownloadPresignedUrl({
          bucket: awsBucketName,
          objectKey: processedFileKey,
        });
      } catch (error) {
        console.error('Error generating download URL:', error);
      }
    }
  }

  res.json({
    jobId: job.jobId,
    status: job.status,
    result: job.result,
    error: job.error,
    downloadUrl,
    processedFileKey,
  });
};
