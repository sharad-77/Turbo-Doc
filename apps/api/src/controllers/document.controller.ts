import { convertDocumentSchema, mergePdfSchema, splitPdfSchema } from '@repo/zod-schemas';
import { error } from 'console';
import { Request, Response } from 'express';
import {
  convertFilesService,
  mergePdfService,
  splitPdfService,
} from '../services/documents/document-services.js';

interface AuthenticatedRequest extends Request {
  userId?: string;
  guestId?: string;
}

export const mergePdfController = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const parse = mergePdfSchema.safeParse(req.body);

    if (!parse.success) {
      return res.status(400).json({ error: parse.error.message });
    }

    const { keys, originalFileName, originalFormat, fileSize } = parse.data;

    const userId = req.userId;
    const guestUsageId = req.guestId;

    const job = await mergePdfService(
      keys,
      originalFileName,
      originalFormat,
      fileSize,
      userId,
      guestUsageId
    );

    return res.json(job);
  } catch (err) {
    console.error('Merge PDF error:', err);
    res.status(500).json({ error: 'Internal Server Error', message:err });
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

export const convertController = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const parse = convertDocumentSchema.safeParse(req.body);

    if (!parse.success) {
      return res.status(400).json({ error: parse.error.flatten() });
    }

    const { key, targetFormat, originalFileName, originalFormat, fileSize } = parse.data;

    const userId = req.userId;
    const guestUsageId = req.guestId;

    const job = await convertFilesService(
      key,
      targetFormat,
      originalFileName,
      originalFormat,
      fileSize,
      userId,
      guestUsageId
    );

    return res.json(job);
  } catch (error) {
    console.error('Conversion error:', error);
    return res.status(500).json({ error: 'Conversion Failed' });
  }
};
