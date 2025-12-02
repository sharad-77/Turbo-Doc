import { createPersignedUrlwithClient } from '@repo/file-upload';
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
