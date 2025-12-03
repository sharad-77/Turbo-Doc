import { Request, Response } from 'express';
import {
  compressImageService,
  convertImageFormatService,
  resizeImageService,
} from '../services/image/image.conversion.services.js';

export const convertImageController = async (req: Request, res: Response) => {
  const { key, format } = req.body;

  const uploadedKey = await convertImageFormatService(key, format);

  res.json({
    message: 'Image converted successfully',
    outputKey: uploadedKey,
  });
};

export const compressImageController = async (req: Request, res: Response) => {
  try {
    const { key, quality } = req.body;

    if (!key) return res.status(400).json({ error: 'key is required' });
    if (!quality || quality < 1 || quality > 100) {
      return res.status(400).json({ error: 'quality must be between 1–100' });
    }

    const uploadedKey = await compressImageService(key, quality);

    res.json({
      message: 'Image compressed successfully',
      outputKey: uploadedKey,
    });
  } catch (err) {
    console.error('Compression Error:', err);
    res.status(500).json({ error: err || 'Compression failed' });
  }
};

export const resizeImageController = async (req: Request, res: Response) => {
  try {
    const { key, scalePercent } = req.body;

    if (!key) return res.status(400).json({ error: 'key is required' });

    if (!scalePercent || scalePercent < 25 || scalePercent > 200) {
      return res.status(400).json({ error: 'scalePercent must be between 25–200' });
    }

    const uploadedKey = await resizeImageService(key, scalePercent);

    res.json({
      message: 'Image resized successfully',
      outputKey: uploadedKey,
    });
  } catch (error) {
    console.error('Resize Error:', error);
    res.status(500).json({ error: error || 'Resize failed' });
  }
};
