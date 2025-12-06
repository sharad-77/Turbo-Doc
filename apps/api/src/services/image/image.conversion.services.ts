import { prisma } from '@repo/database';
import { workerService } from '../worker.service.js';

export const convertImageFormatService = async (
  s3Key: string,
  targetFormat: 'jpeg' | 'jpg' | 'webp' | 'avif' | 'png' | 'gif',
  userId: string | undefined, // Make explicit type
  guestUsageId: string | undefined,
  originalFileName: string,
  originalFormat: string,
  fileSize: number,
  width: number = 0, // Keep default 0 if not provided by Zod optional
  height: number = 0
) => {
  const newImage = await prisma.image.create({
    data: {
      originalFileName: originalFileName,
      originalFormat: originalFormat,
      fileSize: fileSize,
      width: width,
      height: height,
      s3Key: s3Key,
      s3Bucket: process.env.AWS_BUCKET_NAME || 'default-bucket',
      operation: 'FORMAT_CONVERSION',
      status: 'PENDING',
      targetFormat: targetFormat,
      userId: userId,
      guestUsageId: guestUsageId,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      planSnapshot: 'FREE',
    },
  });

  const newJob = await prisma.job.create({
    data: {
      type: 'IMAGE',
      task: 'convert',
      status: 'QUEUED',
      data: {
        imageId: newImage.id,
        s3Key: s3Key,
        targetFormat: targetFormat,
      },
      userId: userId,
      guestUsageId: guestUsageId,
    },
  });

  return await workerService.runImageJob({
    type: 'convert',
    key: s3Key,
    targetFormat,
    imageId: newImage.id,
    jobId: newJob.id,
  });
};

export const compressImageService = async (
  s3Key: string,
  quality: number, // 1–100
  userId: string | undefined,
  guestUsageId: string | undefined,
  originalFileName: string,
  originalFormat: string,
  fileSize: number,
  width: number = 0,
  height: number = 0
) => {
  const newImage = await prisma.image.create({
    data: {
      originalFileName: originalFileName,
      originalFormat: originalFormat,
      fileSize: fileSize,
      width: width,
      height: height,
      s3Key: s3Key,
      s3Bucket: process.env.AWS_BUCKET_NAME || 'default-bucket',
      operation: 'COMPRESS',
      status: 'PENDING',
      compressionQuality: quality,
      userId: userId,
      guestUsageId: guestUsageId,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      planSnapshot: 'FREE',
    },
  });

  const newJob = await prisma.job.create({
    data: {
      type: 'IMAGE',
      task: 'compress',
      status: 'QUEUED',
      data: {
        imageId: newImage.id,
        s3Key: s3Key,
        quality: quality,
      },
      userId: userId,
      guestUsageId: guestUsageId,
    },
  });

  return await workerService.runImageJob({
    type: 'compress',
    key: s3Key,
    quality,
    imageId: newImage.id,
    jobId: newJob.id,
  });
};

export const resizeImageService = async (
  s3Key: string,
  scalePercent: number, // 25–200
  userId: string | undefined,
  guestUsageId: string | undefined,
  originalFileName: string,
  originalFormat: string,
  fileSize: number,
  width: number = 0,
  height: number = 0
) => {
  const newImage = await prisma.image.create({
    data: {
      originalFileName: originalFileName,
      originalFormat: originalFormat,
      fileSize: fileSize,
      width: width,
      height: height,
      s3Key: s3Key,
      s3Bucket: process.env.AWS_BUCKET_NAME || 'default-bucket',
      operation: 'RESIZE',
      status: 'PENDING',
      additionalInfo: { scalePercent },
      userId: userId,
      guestUsageId: guestUsageId,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      planSnapshot: 'FREE',
    },
  });

  const newJob = await prisma.job.create({
    data: {
      type: 'IMAGE',
      task: 'resize',
      status: 'QUEUED',
      data: {
        imageId: newImage.id,
        s3Key: s3Key,
        scalePercent: scalePercent,
      },
      userId: userId,
      guestUsageId: guestUsageId,
    },
  });

  return await workerService.runImageJob({
    type: 'resize',
    key: s3Key,
    scalePercent,
    imageId: newImage.id,
    jobId: newJob.id,
  });
};
