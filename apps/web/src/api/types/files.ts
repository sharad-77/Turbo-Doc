export type FileType = 'document' | 'image';

export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: FileType;
  format: string;
  status: string;
  createdAt: string;
  processedS3Key?: string;
  downloadUrl?: string;
}

export interface UserFile {
  id: string;
  name: string;
  size: number;
  type: FileType;
  format: string;
  status: string;
  createdAt: Date;
  processedS3Key?: string;
}
