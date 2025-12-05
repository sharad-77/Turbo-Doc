import { workerService } from '../worker.service.js';

// MergePDF Service Logic
export const mergePdfService = async (keys: string[]) => {
  return await workerService.runDocumentJob({
    type: 'merge',
    keys,
  });
};

// SplitPDF Service Logic
export const splitPdfService = async (key: string, startPage: number, endPage: number) => {
  return await workerService.runDocumentJob({
    type: 'split',
    key,
    startPage,
    endPage,
  });
};

// Main Dynamic conversion service
export const convertFilesService = async (
  s3Key: string,
  targetFormat: 'pdf' | 'docx' | 'txt' | 'doc'
) => {
  return await workerService.runDocumentJob({
    type: 'convert',
    key: s3Key,
    targetFormat,
  });
};
