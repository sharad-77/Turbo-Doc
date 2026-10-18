export type ImageFormat = 'jpeg' | 'jpg' | 'webp' | 'avif' | 'png' | 'gif';

export interface ConvertImageRequest {
  key: string;
  format: ImageFormat;
  originalFileName: string;
  originalFormat: string;
  fileSize: number;
  width?: number;
  height?: number;
}

export interface CompressImageRequest {
  key: string;
  quality: number; // 1-100
  originalFileName: string;
  originalFormat: string;
  fileSize: number;
  width?: number;
  height?: number;
}

export interface ResizeImageRequest {
  key: string;
  scalePercent: number; // 25-200
  originalFileName: string;
  originalFormat: string;
  fileSize: number;
  width?: number;
  height?: number;
}
