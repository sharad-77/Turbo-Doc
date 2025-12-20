import { prisma } from '@repo/database';
import { downloadFromS3, uploadToS3 } from '@repo/file-upload';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import type { Job } from '../types/worker.types.js';
import { Paths } from '../utils/path.js';

const convertImageFormatWorker = async (
  s3Key: string,
  targetFormat: 'jpeg' | 'jpg' | 'webp' | 'avif' | 'png' | 'gif'
) => {
  Paths.ensureFolders();

  const buffer = await downloadFromS3(`temporary/${s3Key}`);
  const ext = path.extname(s3Key);
  const fileName = `${uuidv4()}${ext}`;
  const rawPath = Paths.raw(fileName);

  fs.writeFileSync(rawPath, buffer);

  const outputName = `${uuidv4()}.${targetFormat === 'jpg' ? 'jpeg' : targetFormat}`;
  const processedPath = Paths.processed(outputName);

  let image = sharp(rawPath);

  switch (targetFormat) {
    case 'jpeg':
    case 'jpg':
      image = image.jpeg({ quality: 90 });
      break;
    case 'png':
      image = image.png();
      break;
    case 'webp':
      image = image.webp({ quality: 90 });
      break;
    case 'avif':
      image = image.avif({ quality: 80 });
      break;
    case 'gif':
      image = image.gif();
      break;
    default:
      throw new Error(`Unsupported format: ${targetFormat}`);
  }

  await image.toFile(processedPath);

  const outputFileSize = fs.statSync(processedPath).size;

  const metadata = await sharp(processedPath).metadata();

  const uploadedKey = `processed/${outputName}`;
  await uploadToS3({
    localPath: processedPath,
    key: uploadedKey,
    bucket: process.env.AWS_BUCKET_NAME,
  });

  if (fs.existsSync(rawPath)) fs.unlinkSync(rawPath);
  if (fs.existsSync(processedPath)) fs.unlinkSync(processedPath);

  return {
    key: uploadedKey,
    size: outputFileSize,
    width: metadata.width || 0,
    height: metadata.height || 0,
  };
};

const compressImageWorker = async (s3Key: string, quality: number) => {
  Paths.ensureFolders();

  const buffer = await downloadFromS3(`temporary/${s3Key}`);
  const ext = path.extname(s3Key);
  const fileName = `${uuidv4()}${ext}`;
  const rawPath = Paths.raw(fileName);

  fs.writeFileSync(rawPath, buffer);

  const metadata = await sharp(rawPath).metadata();
  const format = metadata.format;

  const outputName = `${uuidv4()}.${format}`;
  const processedPath = Paths.processed(outputName);

  let image = sharp(rawPath);

  switch (format) {
    case 'jpeg':
    case 'jpg':
      image = image.jpeg({ quality });
      break;
    case 'png':
      image = image.png({ quality });
      break;
    case 'webp':
      image = image.webp({ quality });
      break;
    case 'avif':
      image = image.avif({ quality });
      break;
    default:
      image = image.toFormat(format as keyof sharp.FormatEnum);
  }

  await image.toFile(processedPath);

  const outputFileSize = fs.statSync(processedPath).size;
  const processedMetadata = await sharp(processedPath).metadata();

  const uploadedKey = `processed/${outputName}`;
  await uploadToS3({
    localPath: processedPath,
    key: uploadedKey,
    bucket: process.env.AWS_BUCKET_NAME,
  });

  if (fs.existsSync(rawPath)) fs.unlinkSync(rawPath);
  if (fs.existsSync(processedPath)) fs.unlinkSync(processedPath);

  return {
    key: uploadedKey,
    size: outputFileSize,
    width: processedMetadata.width || 0,
    height: processedMetadata.height || 0,
  };
};

const resizeImageWorker = async (s3Key: string, scalePercent: number) => {
  Paths.ensureFolders();

  const buffer = await downloadFromS3(`temporary/${s3Key}`);
  const ext = path.extname(s3Key);
  const fileName = `${uuidv4()}${ext}`;
  const rawPath = Paths.raw(fileName);

  fs.writeFileSync(rawPath, buffer);

  const metadata = await sharp(rawPath).metadata();
  const originalWidth = metadata.width || 0;
  const originalHeight = metadata.height || 0;
  const format = metadata.format;

  const newWidth = Math.round((originalWidth * scalePercent) / 100);
  const newHeight = Math.round((originalHeight * scalePercent) / 100);

  const outputName = `${uuidv4()}.${format}`;
  const processedPath = Paths.processed(outputName);

  await sharp(rawPath)
    .resize(newWidth, newHeight, {
      fit: 'fill',
    })
    .toFile(processedPath);

  const outputFileSize = fs.statSync(processedPath).size;

  const uploadedKey = `processed/${outputName}`;
  await uploadToS3({
    localPath: processedPath,
    key: uploadedKey,
    bucket: process.env.AWS_BUCKET_NAME,
  });

  if (fs.existsSync(rawPath)) fs.unlinkSync(rawPath);
  if (fs.existsSync(processedPath)) fs.unlinkSync(processedPath);

  return {
    key: uploadedKey,
    size: outputFileSize,
    width: newWidth,
    height: newHeight,
  };
};

export default async function (job: Job) {
  console.log('[ImageWorker] Received job:', JSON.stringify(job, null, 2));

  const { imageId, jobId } = job.data;

  if (jobId && imageId) {
    await prisma.job.update({ where: { id: jobId }, data: { status: 'PROCESSING' } });
    await prisma.image.update({
      where: { id: imageId },
      data: { status: 'PROCESSING', processingStartedAt: new Date() },
    });
  }

  try {
    let result: { key: string; size: number; width: number; height: number };

    switch (job.task) {
      case 'convert':
        console.log('[ImageWorker] Converting format to:', job.data.targetFormat);
        result = await convertImageFormatWorker(job.data.key, job.data.targetFormat);
        break;
      case 'compress':
        console.log('[ImageWorker] Compressing with quality:', job.data.quality);
        result = await compressImageWorker(job.data.key, job.data.quality);
        break;
      case 'resize':
        console.log('[ImageWorker] Resizing to scale:', job.data.scalePercent);
        result = await resizeImageWorker(job.data.key, job.data.scalePercent);
        break;
      default:
        throw new Error(`Unknown task: ${job.task}`);
    }

    console.log('[ImageWorker] Processing complete:', result);

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
            result: { success: true, outputKey: result.key },
          },
        }),
      ]);
    }

    return { s3Key: result.key };
  } catch (err) {
    const error = err as Error;
    console.error('[ImageWorker] Error:', error.message);
    console.error('[ImageWorker] Stack:', error.stack);

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

    throw new Error(error.message || 'Unknown error');
  }
}
