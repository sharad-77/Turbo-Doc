import { prisma } from '@repo/database';
import type { Job } from '../types/worker.types.js';

/**
 * Database-backed job store for production safety.
 * Replaces in-memory Map to prevent data loss on server restarts.
 */
export const jobStore = {
  /**
   * Store/update job status in database
   */
  async set(jobId: string, jobData: Job): Promise<void> {
    // The job should already exist in DB (created in service layer)
    // We just update the status, result, and error fields
    await prisma.job
      .update({
        where: { id: jobId },
        data: {
          status: jobData.status.toUpperCase() as 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED',
          ...(jobData.result && { result: jobData.result }),
          ...(jobData.error && { error: jobData.error }),
        },
      })
      .catch(err => {
        // If job doesn't exist yet, log but don't throw
        // This can happen in race conditions during initial job creation
        console.warn(`Failed to update job ${jobId}:`, err.message);
      });
  },

  /**
   * Retrieve job from database
   */
  async get(jobId: string): Promise<Job | null> {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    if (!job) {
      return null;
    }

    // Convert database job to Job type
    return {
      jobId: job.id,
      type: job.type.toLowerCase() as 'doc' | 'image',
      task: job.task,
      data: job.data as any,
      status: job.status.toLowerCase() as 'queued' | 'processing' | 'completed' | 'failed',
      result: job.result as any,
      error: job.error || undefined,
      createdAt: job.createdAt,
    };
  },
};
