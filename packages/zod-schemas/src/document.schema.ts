import { z } from 'zod';

export const mergePdfSchema = z.object({
  keys: z.array(z.string().endsWith('.pdf')).min(2),
  originalFileName: z.string(),
  originalFormat: z.literal('pdf'),
  fileSize: z.number().min(1),
});

export const splitPdfSchema = z.object({
  key: z.string().endsWith('.pdf').min(1),
  startPage: z.number().min(0),
  endPage: z.number().min(1),
  originalFileName: z.string(),
  fileSize: z.number().min(1),
});

export const convertDocumentSchema = z.object({
  key: z.string().min(1),
  targetFormat: z.enum(['pdf', 'docx', 'txt', 'doc']),
  originalFileName: z.string().min(1),
  originalFormat: z.enum(['pdf', 'docx', 'txt', 'doc']),
  fileSize: z.number().min(1),
});

export type MergePdfInput = z.infer<typeof mergePdfSchema>;
export type SplitPdfInput = z.infer<typeof splitPdfSchema>;
export type ConvertDocumentInput = z.infer<typeof convertDocumentSchema>;
