import { createDownloadPresignedUrl, createPersignedUrlwithClient } from '@repo/file-upload';
import { Request, Response } from 'express';
import mime from 'mime-types';
import { v4 as uuidv4 } from 'uuid';

const awsBucketName = process.env.AWS_BUCKET_NAME;

export const getPresignedUrl = async (req: Request, res: Response) => {
  const { folder, mime: mimeType, fileName } = req.body;
  // console.log("Received body:", req.body);
  // console.log("Received mimeType:", mimeType);

  let finalMimeType = mimeType;

  if (!finalMimeType && fileName) {
    finalMimeType = mime.lookup(fileName);
    // console.log("Deduced mimeType from fileName:", finalMimeType);
  }

  if (!finalMimeType) {
    return res.status(400).json({ error: 'mime is required' });
  }

  // Convert MIME → extension
  const ext = mime.extension(finalMimeType);

  if (!ext) {
    return res.status(400).json({ error: 'Unsupported file type' });
  }

  // Final filename with correct extension
  const FileName = `${uuidv4()}.${ext}`;
  const objectKey = `${folder}/${FileName}`;

  const url = await createPersignedUrlwithClient({
    bucket: awsBucketName!,
    objectKey: objectKey,
  });

  return res.json({ url, objectKey });
};

export const getDownloadPresignedUrl = async (req: Request, res: Response) => {
  const { objectKey } = req.body;

  if (!objectKey) {
    return res.status(400).json({ error: 'objectKey is required' });
  }

  if (!awsBucketName) {
    return res.status(500).json({ error: 'AWS bucket name not configured' });
  }

  try {
    const url = await createDownloadPresignedUrl({
      bucket: awsBucketName,
      objectKey: objectKey,
    });

    return res.json({ url, objectKey });
  } catch (error) {
    console.error('Error generating download presigned URL:', error);
    return res.status(500).json({ error: 'Failed to generate download URL' });
  }
};

export const downloadFile = async (req: Request, res: Response) => {
  const { objectKey } = req.query;

  if (!objectKey || typeof objectKey !== 'string') {
    return res.status(400).json({ error: 'objectKey is required' });
  }

  if (!awsBucketName) {
    return res.status(500).json({ error: 'AWS bucket name not configured' });
  }

  try {
    const { downloadFromS3 } = await import('@repo/file-upload');
    const buffer = await downloadFromS3(objectKey);

    // Extract filename from objectKey
    const fileName = objectKey.split('/').pop() || 'download';

    // Set appropriate headers
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Length', buffer.length.toString());

    // Send the file
    res.send(buffer);
  } catch (error) {
    console.error('Error downloading file:', error);
    return res.status(500).json({ error: 'Failed to download file' });
  }
};
