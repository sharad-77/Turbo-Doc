import { downloadFromS3, uploadToS3 } from '@repo/file-upload';
import { execFile } from 'child_process';
import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';
import { promisify } from 'util';
import { Paths } from '../../utils/path.js';

const execFileAsync = promisify(execFile);

// MergePDF Service Logic
export const mergePdfService = async (keys: string[]) => {
  Paths.ensureFolders();

  const rawFiles: string[] = [];

  // 1. Download PDFs into temp/raw
  for (const key of keys) {
    const buffer = await downloadFromS3(`temporary/${key}`);
    const fileName = key.split('/').pop() || `file-${Date.now()}.pdf`;
    const rawPath = Paths.raw(fileName);

    fs.writeFileSync(rawPath, buffer);
    rawFiles.push(rawPath);
  }

  // 2. Merge PDFs
  const mergedPdf = await PDFDocument.create();

  for (const file of rawFiles) {
    const pdfBytes = fs.readFileSync(file);
    const donorPdf = await PDFDocument.load(pdfBytes);
    const pages = await mergedPdf.copyPages(donorPdf, donorPdf.getPageIndices());

    pages.forEach(p => mergedPdf.addPage(p));
  }

  const finalPdfBytes = await mergedPdf.save();

  // 3. Save merged result to temp/processed
  const outputName = `merged-${Date.now()}.pdf`;
  const processedPath = Paths.processed(outputName);

  fs.writeFileSync(processedPath, finalPdfBytes);

  // 4. Upload result to S3
  const s3Key = `processed/${outputName}`;

  await uploadToS3({
    localPath: processedPath,
    key: s3Key,
    bucket: process.env.AWS_BUCKET_NAME,
  });

  // 5. Cleanup
  rawFiles.forEach(f => fs.existsSync(f) && fs.unlinkSync(f));
  if (fs.existsSync(processedPath)) fs.unlinkSync(processedPath);

  return s3Key;
};

// SplitPDF Service Logic
export const splitPdfService = async (key: string, startPage: number, endPage: number) => {
  Paths.ensureFolders();

  // 1. Download original PDF
  const buffer = await downloadFromS3(`temporary/${key}`);
  const fileName = key.split('/').pop() || `file-${Date.now()}.pdf`;
  const rawPath = Paths.raw(fileName);
  fs.writeFileSync(rawPath, buffer);

  // 2. Load and validate
  const originalPdf = await PDFDocument.load(fs.readFileSync(rawPath));
  const totalPages = originalPdf.getPageCount();

  if (startPage > totalPages) {
    fs.unlinkSync(rawPath);
    throw new Error(`startPage (${startPage}) is greater than total pages (${totalPages})`);
  }

  const safeStart = Math.max(1, startPage);
  const safeEnd = Math.min(endPage, totalPages);

  const startIndex = safeStart - 1;
  const endIndex = safeEnd - 1;

  // 3. Extract pages
  const splitDoc = await PDFDocument.create();
  const pageIndices = Array.from({ length: endIndex - startIndex + 1 }, (_, i) => startIndex + i);

  const copiedPages = await splitDoc.copyPages(originalPdf, pageIndices);
  copiedPages.forEach(p => splitDoc.addPage(p));

  const splitBytes = await splitDoc.save();

  // 4. Save output
  const outputName = `split-${safeStart}-to-${safeEnd}-${Date.now()}.pdf`;
  const processedPath = Paths.processed(outputName);
  fs.writeFileSync(processedPath, splitBytes);

  // 5. Upload to S3
  const s3Key = `processed/${outputName}`;
  await uploadToS3({
    localPath: processedPath,
    key: s3Key,
    bucket: process.env.AWS_BUCKET_NAME,
  });

  // 6. Cleanup
  if (fs.existsSync(rawPath)) fs.unlinkSync(rawPath);
  if (fs.existsSync(processedPath)) fs.unlinkSync(processedPath);

  return s3Key;
};

// Generic LibraOffice Conversion
export const convertWithLibreOffice = async (
  inputPath: string,
  outputDir: string,
  targetFormat: 'pdf' | 'docx' | 'txt' | 'doc'
): Promise<string> => {
  const ext = path.extname(inputPath).toLowerCase();

  const command = 'soffice';

  const args = ['--headless', '--convert-to', targetFormat];

  // Use PDF-specific filter ONLY when input is PDF
  if (ext === '.pdf') {
    args.push(`--infilter=writer_pdf_import`);
  }

  args.push('--outdir', outputDir, inputPath);

  try {
    await execFileAsync(command, args);

    const baseName = path.basename(inputPath, path.extname(inputPath));
    const outputPath = path.join(outputDir, `${baseName}.${targetFormat}`);

    return outputPath;
  } catch (err) {
    const error = err as Error;
    throw new Error(`LibreOffice conversion Failed: ${error.message}`);
  }
};

// Main Dynamic conversion service
export const convertFilesService = async (
  s3Key: string,
  targetFormat: 'pdf' | 'docx' | 'txt' | 'doc'
) => {
  Paths.ensureFolders();

  const buffer = await downloadFromS3(`temporary/${s3Key}`);

  const fileName = s3Key.split('/').pop() || `file-${Date.now()}`;
  const rawPath = Paths.raw(fileName);

  fs.writeFileSync(rawPath, buffer);

  // 2. Convert Format
  const outputPath = await convertWithLibreOffice(rawPath, Paths.processed(''), targetFormat);

  const outputName = path.basename(outputPath);

  // 3. Upload to S3
  const uploadedKey = `processed/${outputName}`;
  await uploadToS3({
    localPath: outputPath,
    key: uploadedKey,
    bucket: process.env.AWS_BUCKET_NAME,
  });

  // 4. CleanUp The Temp/ Folder After Conversion and File upload
  if (fs.existsSync(rawPath)) fs.unlinkSync(rawPath);
  if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);

  return uploadedKey;
};
