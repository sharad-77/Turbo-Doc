import { imageCompressionSchema, imageConvertSchema, imageResizeSchema } from '@repo/zod-schemas';
import { Request, Response } from 'express';
import {
  compressImageService,
  convertImageFormatService,
  resizeImageService,
} from '../services/image/image.conversion.services.js';

interface AuthenticatedRequest extends Request {
  userId?: string;
  guestId?: string;
}

export const convertImageController = async (req: AuthenticatedRequest, res: Response) => {
  const parse = imageConvertSchema.safeParse(req.body);

  if (!parse.success) {
    return res.status(400).json({ error: parse.error.message });
  }

  const { key, format, originalFileName, originalFormat, fileSize, width, height } = parse.data;

  const job = await convertImageFormatService(
    key,
    format,
    req.userId,
    req.guestId,
    originalFileName,
    originalFormat,
    fileSize,
    width,
    height
  );

  res.json(job);
};

export const compressImageController = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const parse = imageCompressionSchema.safeParse(req.body);

    if (!parse.success) {
      return res.status(400).json({ error: parse.error.message });
    }

    const { key, quality, originalFileName, originalFormat, fileSize, width, height } = parse.data;

    const job = await compressImageService(
      key,
      quality,
      req.userId,
      req.guestId,
      originalFileName,
      originalFormat,
      fileSize,
      width,
      height
    );

    res.json(job);
  } catch (err) {
    console.error('Compression Error:', err);
    res.status(500).json({ error: err || 'Compression failed' });
  }
};

export const resizeImageController = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const parse = imageResizeSchema.safeParse(req.body);

    if (!parse.success) {
      return res.status(400).json({ error: parse.error.message });
    }

    const { key, scalePercent, originalFileName, originalFormat, fileSize, width, height } =
      parse.data;

    const job = await resizeImageService(
      key,
      scalePercent,
      req.userId,
      req.guestId,
      originalFileName,
      originalFormat,
      fileSize,
      width,
      height
    );

    res.json(job);
  } catch (error) {
    console.error('Resize Error:', error);
    res.status(500).json({ error: error || 'Resize failed' });
  }
};
