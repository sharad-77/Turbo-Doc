import { workerService } from '../worker.service.js';

export const convertImageFormatService = async (
  s3Key: string,
  targetFormat: 'jpeg' | 'jpg' | 'webp' | 'avif' | 'png' | 'gif'
) => {
  return await workerService.runImageJob({
    type: 'convert',
    key: s3Key,
    targetFormat,
  });
};

export const compressImageService = async (
  s3Key: string,
  quality: number // 1–100
) => {
  return await workerService.runImageJob({
    type: 'compress',
    key: s3Key,
    quality,
  });
};

export const resizeImageService = async (
  s3Key: string,
  scalePercent: number // 25–200
) => {
  return await workerService.runImageJob({
    type: 'resize',
    key: s3Key,
    scalePercent,
  });
};
