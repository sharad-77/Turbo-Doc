import { downloadFromS3 as s3Download, uploadToS3 } from '@repo/file-upload';
import fs from 'fs';
import { Paths } from '../utils/path.js';

export const downloadToTemp = async (s3Key: string) => {
  Paths.ensureFolders();

  const buffer = await s3Download(s3Key);

  const fileName = s3Key.split('/').pop() || `file-${Date.now()}`;

  const localPath = Paths.raw(fileName);

  fs.writeFileSync(localPath, buffer);

  return localPath;
};

export const uploadFromTemp = async (localPath: string, outputName: string) => {
  const s3Key = `processed/${outputName}`;

  await uploadToS3({
    localPath,
    key: s3Key,
    bucket: process.env.AWS_BUCKET_NAME,
  });

  return s3Key;
};

export const cleanupLocalFile = (filePath: string) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};
