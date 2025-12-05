import { z } from 'zod';

export const mergePdfSchema = z.object({
  keys: z.array(z.string().endsWith('.pdf')).min(2),
});

export const splitPdfSchema = z.object({
  key: z.string().endsWith('.pdf').min(1),
  startPage: z.number().min(0),
  endPage: z.number().min(1),
});

export const convertDocumentSchema = z.object({
  key: z.string().min(1),
  targetFormat: z.enum(['pdf', 'docx', 'txt', 'doc']),
});

export type MergePdfInput = z.infer<typeof mergePdfSchema>;
export type SplitPdfInput = z.infer<typeof splitPdfSchema>;
export type ConvertDocumentInput = z.infer<typeof convertDocumentSchema>;
