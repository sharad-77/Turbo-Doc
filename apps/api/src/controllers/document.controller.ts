import { Request, Response } from 'express';
import {
  convertFilesService,
  mergePdfService,
  splitPdfService,
} from '../services/conversion/document-to-pdf.service.js';

export const mergePdfController = async (req: Request, res: Response) => {
  try {
    const { keys } = req.body;

    if (!Array.isArray(keys)) {
      return res.status(400).json({ error: 'keys[] array is required' });
    }

    const s3Key = await mergePdfService(keys);

    return res.json({
      message: 'Merged and uploaded successfully',
      s3Key,
    });
  } catch (err) {
    console.error('Merge PDF error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const splitPdfController = async (req: Request, res: Response) => {
  try {
    const { key, startPage, endPage } = req.body;

    if (!key || typeof startPage !== 'number' || typeof endPage !== 'number') {
      return res.status(400).json({
        error: 'key, startPage and endPage are required numbers',
      });
    }

    const s3Key = await splitPdfService(key, startPage, endPage);

    return res.json({
      message: 'PDF split and uploaded successfully',
      s3Key,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json('Error in Split pdf');
  }
};

export const convertController = async (req: Request, res: Response) => {
  try {
    const { key, targetFormat } = req.body;

    if (!key || !targetFormat) {
      return res.status(400).json({
        error: 'key and targetFormat (pdf | docx | txt) are required',
      });
    }

    if (!['pdf', 'docx', 'txt', 'doc'].includes(targetFormat)) {
      return res.status(400).json({
        error: 'Invalid targetFormat. Use pdf, docx, doc, or txt.',
      });
    }

    const s3Key = await convertFilesService(key, targetFormat);

    return res.json({
      message: 'File converted and uploaded successfully',
      convertedFile: s3Key,
    });
  } catch (error) {
    console.error('Conversion error:', error);
    return res.status(500).json({ error: 'Conversion Failed' });
  }
};
