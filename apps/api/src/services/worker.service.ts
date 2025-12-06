import { v4 as uuidv4 } from 'uuid';
import { jobStore } from '../queues/job-store.js';
import type { Job } from '../types/worker.types.js';
import { documentPool } from '../workers/pools/document.pool.js';
import { imagePool } from '../workers/pools/image.pool.js';

export const workerService = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  runDocumentJob: async (data: any) => {
    const jobId = data.jobId || uuidv4();

    const job: Job = {
      jobId,
      type: 'doc',
      task: data.type,
      data: data,
      status: 'queued',
      createdAt: new Date(),
    };

    jobStore.set(jobId, job);

    (async () => {
      try {
        job.status = 'processing';
        jobStore.set(jobId, job);

        const result = await documentPool.run(job);

        job.status = 'completed';
        job.result = result;
        jobStore.set(jobId, job);
      } catch (err) {
        job.status = 'failed';
        job.error = (err as Error).message;
        jobStore.set(jobId, job);
      }
    })();

    return { jobId, status: 'queued' };
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  runImageJob: async (data: any) => {
    const jobId = data.jobId || uuidv4();

    const job: Job = {
      jobId,
      type: 'doc',
      task: data.type,
      data: data,
      status: 'queued',
      createdAt: new Date(),
    };

    jobStore.set(jobId, job);

    (async () => {
      try {
        job.status = 'processing';
        jobStore.set(jobId, job);

        const result = await imagePool.run(job);

        job.status = 'completed';
        job.result = result;
        jobStore.set(jobId, job);
      } catch (err) {
        job.status = 'failed';
        job.error = (err as Error).message;
        jobStore.set(jobId, job);
      }
    })();

    return { jobId, status: 'queued' };
  },

  getJobStatus: (jobId: string) => {
    return jobStore.get(jobId) || null;
  },
};
