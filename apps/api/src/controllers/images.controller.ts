import { imageCompressionSchema, imageConvertScheama, imageResizeSchema } from '@repo/zod-schemas';
import { Request, Response } from 'express';
import {
  compressImageService,
  convertImageFormatService,
  resizeImageService,
} from '../services/image/image.conversion.services.js';

export const convertImageController = async (req: Request, res: Response) => {
  const parse = imageConvertScheama.safeParse(req.body);

  if (!parse.success) {
    return res.status(400).json({ error: parse.error.message });
  }

  const { key, format } = parse.data;

  const job = await convertImageFormatService(key, format);

  res.json(job);
};

export const compressImageController = async (req: Request, res: Response) => {
  try {
    const parse = imageCompressionSchema.safeParse(req.body);

    if (!parse.success) {
      return res.status(400).json({ error: parse.error.message });
    }

    const { key, quality } = parse.data;

    const job = await compressImageService(key, quality);

    res.json(job);
  } catch (err) {
    console.error('Compression Error:', err);
    res.status(500).json({ error: err || 'Compression failed' });
  }
};

export const resizeImageController = async (req: Request, res: Response) => {
  try {
    const parse = imageResizeSchema.safeParse(req.body);

    if (!parse.success) {
      return res.status(400).json({ error: parse.error.message });
    }

    const { key, scalePercent } = parse.data;

    const job = await resizeImageService(key, scalePercent);

    res.json(job);
  } catch (error) {
    console.error('Resize Error:', error);
    res.status(500).json({ error: error || 'Resize failed' });
  }
};
