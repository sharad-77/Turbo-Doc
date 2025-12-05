import { Request, Response } from 'express';
import { workerService } from '../services/worker.service.js';

export const getJobStatusController = (req: Request, res: Response) => {
  const { jobId } = req.params;

  if (!jobId) {
    return res.status(400).json({ error: 'Job ID is required' });
  }

  const job = workerService.getJobStatus(jobId);

  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  res.json({
    jobId: job.jobId,
    status: job.status,
    result: job.result,
    error: job.error,
  });
};
