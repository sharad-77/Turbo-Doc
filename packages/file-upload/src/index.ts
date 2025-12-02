interface PresignedUrlParams {
  bucket: string;
  objectKey: string;
}

import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import fs from 'fs';
import { Readable } from 'stream';
import mime from 'mime-types';

import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const awsBucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_S3_REGION;

if (!accessKeyId || !secretAccessKey) {
  throw new Error('AWS credentials must be set in the .env file.');
}

// Initialize S3 Client
const s3Client = new S3Client({
  region: region,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
});

// Generate Presigned URL for Upload

export const createPersignedUrlwithClient = ({ bucket, objectKey }: PresignedUrlParams) => {
  if (!bucket || !objectKey) {
    throw new Error('Bucket and objectKey are required');
  }
  const command = new PutObjectCommand({ Bucket: bucket, Key: objectKey });
  return getSignedUrl(s3Client, command, { expiresIn: 3600 });
};

// Convert Stream → Buffer (Correct Version)

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('error', err => reject(err));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

// Download file from S3 as buffer

export async function downloadFromS3(key: string) {
  if (!awsBucketName) throw new Error('AWS bucket name missing');
  const command = new GetObjectCommand({
    Bucket: awsBucketName,
    Key: key,
  });
  const response = await s3Client.send(command);
  const stream = response.Body as Readable;
  const buffer = await streamToBuffer(stream);

  return buffer;
}

// Upload Processed File To S3
export const uploadToS3 = async ({
  localPath,
  key,
  bucket,
}: {
  localPath: string;
  key: string;
  bucket?: string;
}) => {
  if (!fs.existsSync(localPath)) {
    throw new Error(`Local file dose not exist: ${localPath}`);
  }

  const fileBuffer = fs.readFileSync(localPath);

  const contentType = mime.lookup(localPath) || 'application/octet-stream';

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType,
  });

  await s3Client.send(command);

  return {
    message: 'Upload to s3',
    key,
    ContentType: contentType,
  };
};
