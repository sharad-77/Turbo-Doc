import { prisma } from '@repo/database';
import { workerService } from '../worker.service.js';

type ConvertTypes = 'pdf' | 'docx' | 'txt' | 'doc';

// MergePDF Service Logic
export const mergePdfService = async (
  keys: string[],
  originalFileName: string,
  originalFormat: string,
  fileSize: number,
  userId?: string,
  guestUsageId?: string
) => {
  const newDoc = await prisma.document.create({
    data: {
      originalFileName: originalFileName,
      originalFormat: originalFormat,
      fileSize: fileSize,

      targetFormat: 'pdf',
      s3Key: JSON.stringify(keys),
      s3Bucket: process.env.AWS_BUCKET_NAME || 'default-bucket',

      status: 'PENDING',
      conversionType: 'MERGE',
      userId: userId,
      guestUsageId: guestUsageId,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      planSnapshot: 'FREE',
    },
  });

  const newJob = await prisma.job.create({
    data: {
      type: 'DOCUMENT',
      task: 'merge',
      status: 'QUEUED',
      data: {
        documentId: newDoc.id,
        s3Key: newDoc.s3Key,
        targetFormat: 'pdf',
      },
      userId: userId,
      guestUsageId: guestUsageId,
    },
  });

  return await workerService.runDocumentJob({
    type: 'merge',
    keys: keys,
    documentId: newDoc.id,
    jobId: newJob.id,
  });
};

// SplitPDF Service Logic
export const splitPdfService = async (key: string, startPage: number, endPage: number) => {
  return await workerService.runDocumentJob({
    type: 'split',
    key,
    startPage,
    endPage,
  });
};

// Main Dynamic conversion service
export const convertFilesService = async (
  s3Key: string,
  targetFormat: ConvertTypes,
  originalFileName: string,
  originalFormat: ConvertTypes,
  fileSize: number,
  userId?: string,
  guestUsageId?: string
) => {
  const newDoc = await prisma.document.create({
    data: {
      originalFileName: originalFileName,
      originalFormat: originalFormat,
      fileSize: fileSize,

      targetFormat: targetFormat,
      s3Key: s3Key,
      s3Bucket: process.env.AWS_BUCKET_NAME || 'default-bucket',

      status: 'PENDING',
      conversionType: 'FORMAT_CONVERSION',
      userId: userId,
      guestUsageId: guestUsageId,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      planSnapshot: 'FREE',
    },
  });

  const newJob = await prisma.job.create({
    data: {
      type: 'DOCUMENT', // or "IMAGE"
      task: 'convert', // or "merge", "split", "resize"
      status: 'QUEUED',
      data: {
        documentId: newDoc.id,
        s3Key: newDoc.s3Key,
        targetFormat: targetFormat,
      },
      userId: userId,
      guestUsageId: guestUsageId,
    },
  });

  return await workerService.runDocumentJob({
    type: 'convert',
    key: s3Key,
    targetFormat,
    documentId: newDoc.id,
    jobId: newJob.id,
  });
};
