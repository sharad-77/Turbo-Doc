import { prisma } from '@repo/database';
import { workerService } from '../worker.service.js';

type ConvertTypes = 'pdf' | 'docx' | 'txt' | 'doc';

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
      s3Bucket: process.env.AWS_BUCKET_NAME!,

      status: 'PENDING',
      conversionType: 'MERGE',
      userId: userId,
      guestUsageId: guestUsageId,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      planSnapshot: 'FREE',
    },
  });

  if (guestUsageId) {
    await prisma.guestUsage.update({
      where: { id: guestUsageId },
      data: { mergeCount: { increment: 1 } },
    });
  }

  if (userId) {
    await prisma.userUsage.update({
      where: { userId },
      data: {
        mergeCount: { increment: 1 },
        lifetimeDocumentCount: { increment: 1 },
      },
    });
  }

  await prisma.usageLog.create({
    data: {
      userId,
      guestUsageId,
      resourceType: 'DOCUMENT',
      resourceId: newDoc.id,
      operation: 'MERGE',
      resetPeriod: 'DAILY',
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

export const splitPdfService = async (
  key: string,
  startPage: number,
  endPage: number,
  userId: string | undefined,
  guestUsageId: string | undefined,
  originalFileName: string,
  fileSize: number
) => {
  const newDoc = await prisma.document.create({
    data: {
      originalFileName: originalFileName,
      originalFormat: 'pdf',
      fileSize: fileSize,

      targetFormat: 'pdf',
      s3Key: key,
      s3Bucket: process.env.AWS_BUCKET_NAME!,

      status: 'PENDING',
      conversionType: 'SPLIT',
      userId: userId,
      guestUsageId: guestUsageId,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      planSnapshot: 'FREE',
    },
  });

  if (guestUsageId) {
    await prisma.guestUsage.update({
      where: { id: guestUsageId },
      data: { documentCount: { increment: 1 } },
    });
  }

  if (userId) {
    await prisma.userUsage.update({
      where: { userId },
      data: {
        documentCount: { increment: 1 },
        lifetimeDocumentCount: { increment: 1 },
      },
    });
  }

  await prisma.usageLog.create({
    data: {
      userId,
      guestUsageId,
      resourceType: 'DOCUMENT',
      resourceId: newDoc.id,
      operation: 'SPLIT',
      resetPeriod: 'DAILY',
    },
  });

  const newJob = await prisma.job.create({
    data: {
      type: 'DOCUMENT',
      task: 'split',
      status: 'QUEUED',
      data: {
        documentId: newDoc.id,
        s3Key: newDoc.s3Key,
        startPage,
        endPage,
      },
      userId: userId,
      guestUsageId: guestUsageId,
    },
  });

  return await workerService.runDocumentJob({
    type: 'split',
    key,
    startPage,
    endPage,
    documentId: newDoc.id,
    jobId: newJob.id,
  });
};

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
      s3Bucket: process.env.AWS_BUCKET_NAME!,

      status: 'PENDING',
      conversionType: 'FORMAT_CONVERSION',
      userId: userId,
      guestUsageId: guestUsageId,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      planSnapshot: 'FREE',
    },
  });

  if (guestUsageId) {
    await prisma.guestUsage.update({
      where: { id: guestUsageId },
      data: { documentCount: { increment: 1 } },
    });
  }

  if (userId) {
    await prisma.userUsage.update({
      where: { userId },
      data: {
        documentCount: { increment: 1 },
        lifetimeDocumentCount: { increment: 1 },
      },
    });
  }

  await prisma.usageLog.create({
    data: {
      userId,
      guestUsageId,
      resourceType: 'DOCUMENT',
      resourceId: newDoc.id,
      operation: 'PDF_CONVERT',
      resetPeriod: 'DAILY',
    },
  });

  const newJob = await prisma.job.create({
    data: {
      type: 'DOCUMENT',
      task: 'convert',
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
