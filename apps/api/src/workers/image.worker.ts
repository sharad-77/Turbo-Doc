import { prisma } from '@repo/database';
import { downloadFromS3, uploadToS3 } from '@repo/file-upload';
import fs from 'fs';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import type { Job } from '../types/worker.types.js';
// @ts-ignore
import { Paths } from '../utils/path.ts';

// Disable Sharp cache to prevent file locking on Windows
sharp.cache(false);

// --- Service Logic (Moved from image.conversion.services.ts) ---

const convertImageFormatService = async (
  s3Key: string,
  targetFormat: 'jpeg' | 'jpg' | 'webp' | 'avif' | 'png' | 'gif'
) => {
  Paths.ensureFolders();

  // 1. Download directly as buffer
  const buffer = await downloadFromS3(`temporary/${s3Key}`);

  const outputFileName = `${uuidv4()}.${targetFormat}`;
  const outputPath = Paths.processed(outputFileName);

  // 2. Convert directly from buffer (no raw file)
  const outputInfo = await sharp(buffer).toFormat(targetFormat).toFile(outputPath);

  // 3. Upload to S3
  const uploadedKey = `processed/${outputFileName}`;
  await uploadToS3({
    localPath: outputPath,
    key: uploadedKey,
    bucket: process.env.AWS_BUCKET_NAME,
  });

  // 4. Cleanup
  try {
    if (fs.existsSync(outputPath)) {
      await fs.promises.unlink(outputPath);
    }
  } catch (cleanupErr) {
    console.warn(`Failed to cleanup ${outputPath}:`, cleanupErr);
  }

  return {
    key: uploadedKey,
    width: outputInfo.width || 0,
    height: outputInfo.height || 0,
    size: outputInfo.size,
  };
};

const compressImageService = async (
  s3Key: string,
  quality: number // 1–100
) => {
  Paths.ensureFolders();

  // 1. Download image from S3
  const buffer = await downloadFromS3(`temporary/${s3Key}`);

  // 2. Detect original format
  const metadata = await sharp(buffer).metadata();
  const format = metadata.format || 'jpeg';

  // 3. Prepare output
  const outputFileName = `${uuidv4()}.${format}`;
  const outputPath = Paths.processed(outputFileName);

  // 4. Compress based on format
  let pipeline = sharp(buffer);

  if (format === 'jpeg' || format === 'jpg') {
    pipeline = pipeline.jpeg({ quality });
  } else if (format === 'png') {
    pipeline = pipeline.png({ compressionLevel: 9 });
  } else if (format === 'webp') {
    pipeline = pipeline.webp({ quality });
  } else if (format === 'avif') {
    pipeline = pipeline.avif({ quality });
  } else {
    // fallback
    pipeline = pipeline.jpeg({ quality });
  }

  const outputInfo = await pipeline.toFile(outputPath);

  // 5. Upload to S3
  const uploadedKey = `processed/${outputFileName}`;
  await uploadToS3({
    localPath: outputPath,
    key: uploadedKey,
    bucket: process.env.AWS_BUCKET_NAME,
  });

  // 6. Cleanup
  try {
    if (fs.existsSync(outputPath)) {
      await fs.promises.unlink(outputPath);
    }
  } catch (cleanupErr) {
    console.warn(`Failed to cleanup ${outputPath}:`, cleanupErr);
  }

  return {
    key: uploadedKey,
    width: outputInfo.width || 0,
    height: outputInfo.height || 0,
    size: outputInfo.size,
  };
};

const resizeImageService = async (
  s3Key: string,
  scalePercent: number // 25–200
) => {
  Paths.ensureFolders();

  if (scalePercent < 25 || scalePercent > 200) {
    throw new Error('scalePercent must be between 25 and 200');
  }

  // 1. Download buffer
  const buffer = await downloadFromS3(`temporary/${s3Key}`);

  // 2. Get original metadata
  const metadata = await sharp(buffer).metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error('Unable to read image dimensions');
  }

  // Scale width & height
  const scale = scalePercent / 100;
  const newWidth = Math.round(metadata.width * scale);
  const newHeight = Math.round(metadata.height * scale);

  // 3. Prepare output
  const outputFormat = metadata.format || 'jpeg';
  const outputFileName = `${uuidv4()}.${outputFormat}`;
  const outputPath = Paths.processed(outputFileName);

  // 4. Resize image
  const outputInfo = await sharp(buffer).resize(newWidth, newHeight).toFile(outputPath);

  // 5. Upload to S3
  const uploadedKey = `processed/${outputFileName}`;
  await uploadToS3({
    localPath: outputPath,
    key: uploadedKey,
    bucket: process.env.AWS_BUCKET_NAME,
  });

  // 6. Cleanup
  try {
    if (fs.existsSync(outputPath)) {
      await fs.promises.unlink(outputPath);
    }
  } catch (cleanupErr) {
    console.warn(`Failed to cleanup ${outputPath}:`, cleanupErr);
  }

  return {
    key: uploadedKey,
    width: outputInfo.width || 0,
    height: outputInfo.height || 0,
    size: outputInfo.size,
  };
};

// --- Worker Entry Point ---

export default async function (job: Job) {
  const { imageId, jobId } = job.data;

  // 1. Start Processing (Update DB)
  if (jobId && imageId) {
    await prisma.job.update({ where: { id: jobId }, data: { status: 'PROCESSING' } });
    await prisma.image.update({
      where: { id: imageId },
      data: { status: 'PROCESSING', processingStartedAt: new Date() },
    });
  }

  try {
    let result: { key: string; width: number; height: number; size: number };

    switch (job.task) {
      case 'convert':
        result = await convertImageFormatService(job.data.key, job.data.targetFormat);
        break;
      case 'compress':
        result = await compressImageService(job.data.key, job.data.quality);
        break;
      case 'resize':
        result = await resizeImageService(job.data.key, job.data.scalePercent);
        break;
      default:
        throw new Error(`Unknown task: ${job.task}`);
    }

    // 2. Success (Update DB)
    if (jobId && imageId) {
      await prisma.$transaction([
        prisma.image.update({
          where: { id: imageId },
          data: {
            status: 'COMPLETED',
            processedS3Key: result.key,
            processedFileSize: result.size,
            processedWidth: result.width,
            processedHeight: result.height,
            processingCompletedAt: new Date(),
          },
        }),
        prisma.job.update({
          where: { id: jobId },
          data: {
            status: 'COMPLETED',
            result: { success: true, outputKey: result.key, ...result },
          },
        }),
      ]);
    }

    return { s3Key: result.key, ...result };
  } catch (err) {
    const error = err as Error;

    // 3. Failure (Update DB)
    if (jobId && imageId) {
      await prisma.$transaction([
        prisma.image.update({
          where: { id: imageId },
          data: {
            status: 'FAILED',
            processingError: error.message,
          },
        }),
        prisma.job.update({
          where: { id: jobId },
          data: {
            status: 'FAILED',
            error: error.message,
          },
        }),
      ]);
    }
    // Re-throw to let Piscina handle the error state
    throw new Error(error.message || 'Unknown error');
  }
}
