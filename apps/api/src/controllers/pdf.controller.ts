import { downloadFronS3, uploadToS3 } from '@repo/file-upload';
import { Request, Response } from 'express';
import fs from 'fs';
import { PDFDocument } from 'pdf-lib';
import { Paths } from '../utils/path.js';

export const mergePdfController = async (req: Request, res: Response) => {
  try {
    const { keys } = req.body;

    if (!keys || !Array.isArray(keys)) {
      return res.status(400).json({ error: 'keys[] array is required' });
    }

    Paths.ensureFolders();

    // Downlaod all PDFs to temp/raw
    const rawFiles: string[] = [];

    for (const key of keys) {
      const buffer = await downloadFronS3(`temporary/${key}`);
      const fileName = key.split('/').pop() || `file-${Date.now()}.pdf`;
      const rawPath = Paths.raw(fileName);

      fs.writeFileSync(rawPath, buffer);
      rawFiles.push(rawPath);
    }

    // Merge PDFs using Pdf-lib
    const mergedPdf = await PDFDocument.create();

    for (const file of rawFiles) {
      const pdfBytes = fs.readFileSync(file);
      const donorPdf = await PDFDocument.load(pdfBytes);
      const pages = await mergedPdf.copyPages(donorPdf, donorPdf.getPageIndices());

      pages.forEach(p => mergedPdf.addPage(p));
    }
    const finalPdfBytes = await mergedPdf.save();

    // Save merged file to temp/processed
    const outputName = `merged-${Date.now()}.pdf`;
    const processedPath = Paths.processed(outputName);

    fs.writeFileSync(processedPath, finalPdfBytes);

    // Upload processed file to S3
    const s3Key = `processed/${outputName}`;

    await uploadToS3({
      localPath: processedPath,
      key: s3Key,
      bucket: process.env.AWS_BUCKET_NAME,
    });

    for (const file of rawFiles) {
      if (fs.existsSync(file)) fs.unlinkSync(file);
    }

    if (fs.existsSync(processedPath)) fs.unlinkSync(processedPath);

    return res.json({
      message: 'Merged and uploaded successfully',
      s3Key,
    });
  } catch (err) {
    console.error('Merge PDF error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
