import { createPersignedUrlwithClient } from '@repo/file-upload';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

const awsBucketName = process.env.AWS_BUCKET_NAME;

export const getPresignedUrl = async (req: Request, res: Response) => {
  const { folder, mime } = req.body;

  const FileName = uuidv4();
  const FinalFileName = `${FileName}.${mime}`;
  const objectKey = `${folder}/${FinalFileName}`;

  const url = await createPersignedUrlwithClient({
    bucket: awsBucketName!,
    objectKey: objectKey,
  });

  res.json({ url, objectKey });
};
