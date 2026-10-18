export type DocumentFormat = 'pdf' | 'docx' | 'txt' | 'doc';

export interface ConvertDocumentRequest {
  key: string;
  targetFormat: DocumentFormat;
  originalFileName: string;
  originalFormat: string;
  fileSize: number;
}

export interface MergePdfRequest {
  keys: string[];
  originalFileName: string;
  originalFormat: string;
  fileSize: number;
}

export interface SplitPdfRequest {
  key: string;
  startPage: number;
  endPage: number;
  originalFileName: string;
  fileSize: number;
}
