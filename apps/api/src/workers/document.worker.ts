import { downloadFromS3, uploadToS3 } from '@repo/file-upload';
import { execFile } from 'child_process';
import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';
import type { Job } from '../types/worker.types.js';
import { Paths } from '../utils/path.js';

const execFileAsync = promisify(execFile);

// MergePDF Service Logic
const mergePdfService = async (keys: string[]) => {
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
  const outputName = `${uuidv4()}.pdf`;
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
const splitPdfService = async (key: string, startPage: number, endPage: number) => {
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
  const outputName = `${uuidv4()}.pdf`;
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
const convertWithLibreOffice = async (
  inputPath: string,
  outputDir: string,
  targetFormat: 'pdf' | 'docx' | 'txt' | 'doc'
): Promise<string> => {
  const ext = path.extname(inputPath).toLowerCase();
  const profileDir = path.join(path.dirname(outputDir), 'profiles', uuidv4());

  // Ensure profile directory exists (soffice might create it, but good to be safe/clean)
  // Actually, for UserInstallation, we just need a unique path.
  // We should ensure the parent 'profiles' dir exists.
  const profilesParent = path.dirname(profileDir);
  if (!fs.existsSync(profilesParent)) {
    fs.mkdirSync(profilesParent, { recursive: true });
  }

  // Format path for UserInstallation URL
  // Windows paths need to be converted to URL format (file:///C:/...)
  const profileUrl = `file:///${profileDir.replace(/\\/g, '/')}`;

  const command = 'soffice';

  const args = [`-env:UserInstallation=${profileUrl}`, '--headless', '--convert-to', targetFormat];

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error = err as any;
    const stderr = error.stderr ? ` Stderr: ${error.stderr}` : '';
    const stdout = error.stdout ? ` Stdout: ${error.stdout}` : '';
    throw new Error(`LibreOffice conversion Failed: ${error.message}${stderr}${stdout}`);
  } finally {
    // Cleanup profile directory
    try {
      if (fs.existsSync(profileDir)) {
        fs.rmSync(profileDir, { recursive: true, force: true });
      }
    } catch (cleanupErr) {
      console.error('Failed to cleanup LibreOffice profile:', cleanupErr);
    }
  }
};

// Main Dynamic conversion service
const convertFilesService = async (s3Key: string, targetFormat: 'pdf' | 'docx' | 'txt' | 'doc') => {
  Paths.ensureFolders();

  const buffer = await downloadFromS3(`temporary/${s3Key}`);

  const ext = path.extname(s3Key);
  const fileName = `${uuidv4()}${ext}`;
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

// --- Worker Entry Point ---

export default async function (job: Job) {
  try {
    let resultS3Key: string;

    switch (job.task) {
      case 'merge':
        resultS3Key = await mergePdfService(job.data.keys);
        break;
      case 'split':
        resultS3Key = await splitPdfService(job.data.key, job.data.startPage, job.data.endPage);
        break;
      case 'convert':
        resultS3Key = await convertFilesService(job.data.key, job.data.targetFormat);
        break;
      default:
        throw new Error(`Unknown task: ${job.task}`);
    }

    return { s3Key: resultS3Key };
  } catch (err) {
    const error = err as Error;
    // Re-throw to let Piscina handle the error state
    throw new Error(error.message || 'Unknown error');
  }
}
