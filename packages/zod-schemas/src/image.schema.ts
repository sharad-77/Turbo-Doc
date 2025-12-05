import { z } from 'zod';

export const imageConvertScheama = z.object({
  key: z.string().min(1, 'key is required'),
  format: z.enum(['jpeg', 'jpg', 'png', 'webp', 'avif', 'gif']),
});

export const imageCompressionSchema = z.object({
  key: z.string().min(1, 'key is required'),
  quality: z.number().min(1).max(100),
});

export const imageResizeSchema = z.object({
  key: z.string().min(1, 'key is required'),
  scalePercent: z.number().min(25).max(200),
});

export type ImageConvertInput = z.infer<typeof imageConvertScheama>;
export type ImageCompressInput = z.infer<typeof imageCompressionSchema>;
export type ImageResizeInput = z.infer<typeof imageResizeSchema>;
