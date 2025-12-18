/**
 * File format validation utilities
 * Validates file formats before uploading to S3 to prevent wasted bandwidth
 * and provide immediate user feedback
 */

// Document format validation
export const SUPPORTED_DOCUMENT_FORMATS = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/msword': ['.doc'],
  'text/plain': ['.txt'],
  'application/vnd.ms-powerpoint': ['.ppt'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
} as const;

// Image format validation (matching backend zod schema)
export const SUPPORTED_IMAGE_FORMATS = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'image/avif': ['.avif'],
  'image/gif': ['.gif'],
} as const;

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates if a document file has a supported format
 * @param file - The file to validate
 * @returns Validation result with error message if invalid
 */
export function validateDocumentFormat(file: File): ValidationResult {
  const extension = ('.' + file.name.split('.').pop()?.toLowerCase()) as string;
  const supportedExtensions = Object.values(SUPPORTED_DOCUMENT_FORMATS).flat();

  if (!supportedExtensions.includes(extension as (typeof supportedExtensions)[number])) {
    return {
      valid: false,
      error: `Unsupported format "${extension}". Supported: PDF, Word (.doc, .docx), PowerPoint (.ppt, .pptx), Excel (.xls, .xlsx), Text (.txt)`,
    };
  }

  return { valid: true };
}

/**
 * Validates if an image file has a supported format
 * @param file - The file to validate
 * @returns Validation result with error message if invalid
 */
export function validateImageFormat(file: File): ValidationResult {
  const extension = ('.' + file.name.split('.').pop()?.toLowerCase()) as string;
  const supportedExtensions = Object.values(SUPPORTED_IMAGE_FORMATS).flat();

  if (!supportedExtensions.includes(extension as (typeof supportedExtensions)[number])) {
    return {
      valid: false,
      error: `Unsupported format "${extension}". Supported: JPEG (.jpg, .jpeg), PNG (.png), WebP (.webp), AVIF (.avif), GIF (.gif)`,
    };
  }

  return { valid: true };
}

/**
 * Gets the file extension without the dot
 * @param filename - The filename to extract extension from
 * @returns The extension in lowercase, or empty string if none
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

/**
 * Gets a user-friendly list of supported document formats
 * @returns Comma-separated list of extensions
 */
export function getSupportedDocumentFormats(): string {
  return Object.values(SUPPORTED_DOCUMENT_FORMATS)
    .flat()
    .map(ext => ext.toUpperCase())
    .join(', ');
}

/**
 * Gets a user-friendly list of supported image formats
 * @returns Comma-separated list of extensions
 */
export function getSupportedImageFormats(): string {
  return Object.values(SUPPORTED_IMAGE_FORMATS)
    .flat()
    .map(ext => ext.toUpperCase())
    .join(', ');
}
