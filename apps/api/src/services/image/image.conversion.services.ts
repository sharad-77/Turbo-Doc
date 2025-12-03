import { downloadFromS3, uploadToS3 } from '@repo/file-upload';
import fs from 'fs';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { Paths } from '../../utils/path.js';

export const convertImageFormatService = async (
  s3Key: string,
  targetFormat: 'jpeg' | 'jpg' | 'webp' | 'avif' | 'png' | 'gif'
) => {
  Paths.ensureFolders();

  // 1. Download directly as buffer
  const buffer = await downloadFromS3(`temporary/${s3Key}`);

  const outputFileName = `${uuidv4()}.${targetFormat}`;
  const outputPath = Paths.processed(outputFileName);

  // 2. Convert directly from buffer (no raw file)
  await sharp(buffer).toFormat(targetFormat).toFile(outputPath);

  // 3. Upload to S3
  const uploadedKey = `processed/${outputFileName}`;
  await uploadToS3({
    localPath: outputPath,
    key: uploadedKey,
    bucket: process.env.AWS_BUCKET_NAME,
  });

  // 4. Cleanup
  if (fs.existsSync(outputPath)) {
    await fs.promises.unlink(outputPath);
  }

  return uploadedKey;
};

export const compressImageService = async (
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

  await pipeline.toFile(outputPath);

  // 5. Upload to S3
  const uploadedKey = `processed/${outputFileName}`;
  await uploadToS3({
    localPath: outputPath,
    key: uploadedKey,
    bucket: process.env.AWS_BUCKET_NAME,
  });

  // 6. Cleanup
  if (fs.existsSync(outputPath)) {
    await fs.promises.unlink(outputPath);
  }

  return uploadedKey;
};

export const resizeImageService = async (
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
  await sharp(buffer).resize(newWidth, newHeight).toFile(outputPath);

  // 5. Upload to S3
  const uploadedKey = `processed/${outputFileName}`;
  await uploadToS3({
    localPath: outputPath,
    key: uploadedKey,
    bucket: process.env.AWS_BUCKET_NAME,
  });

  // 6. Cleanup
  if (fs.existsSync(outputPath)) {
    await fs.promises.unlink(outputPath);
  }

  return uploadedKey;
};
