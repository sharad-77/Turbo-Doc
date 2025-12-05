import { Request, Response } from 'express';
import {
  convertFilesService,
  mergePdfService,
  splitPdfService,
} from '../services/documents/document-services.js';

import { convertDocumentSchema, mergePdfSchema, splitPdfSchema } from '@repo/zod-schemas';

export const mergePdfController = async (req: Request, res: Response) => {
  try {
    const parse = mergePdfSchema.safeParse(req.body);

    if (!parse.success) {
      return res.status(400).json({ error: parse.error.flatten() });
    }

    const { keys } = parse.data;

    const job = await mergePdfService(keys);

    return res.json(job);
  } catch (err) {
    console.error('Merge PDF error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const splitPdfController = async (req: Request, res: Response) => {
  try {
    const parse = splitPdfSchema.safeParse(req.body);

    if (!parse.success) {
      return res.status(400).json({ error: parse.error.flatten() });
    }

    const { key, startPage, endPage } = parse.data;

    const job = await splitPdfService(key, startPage, endPage);

    return res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json('Error in Split pdf');
  }
};

export const convertController = async (req: Request, res: Response) => {
  try {
    const parse = convertDocumentSchema.safeParse(req.body);

    if (!parse.success) {
      return res.status(400).json({ error: parse.error.flatten() });
    }

    const { key, targetFormat } = parse.data;

    const job = await convertFilesService(key, targetFormat);

    return res.json(job);
  } catch (error) {
    console.error('Conversion error:', error);
    return res.status(500).json({ error: 'Conversion Failed' });
  }
};
