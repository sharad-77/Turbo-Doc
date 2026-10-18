interface PresignedUrlParams {
  bucket: string;
  objectKey: string;
}

import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import fs from 'fs';
import mime from 'mime-types';
import { Readable } from 'stream';

// Lazy-initialized S3 client — created on first use, not at import time.
// The consuming app (e.g. apps/api) must load .env before importing this package.
let _s3Client: S3Client | null = null;

function getS3Client(): S3Client {
  if (_s3Client) return _s3Client;

  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const region = process.env.AWS_S3_REGION;

  if (!accessKeyId || !secretAccessKey) {
    throw new Error(
      'AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY must be set. Make sure your app loads .env before importing @repo/file-upload.'
    );
  }

  _s3Client = new S3Client({
    region: region,
    credentials: {
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
    },
  });

  return _s3Client;
}

export const createPersignedUrlwithClient = ({ bucket, objectKey }: PresignedUrlParams) => {
  if (!bucket || !objectKey) {
    throw new Error('Bucket and objectKey are required');
  }
  const command = new PutObjectCommand({ Bucket: bucket, Key: objectKey });
  return getSignedUrl(getS3Client(), command, { expiresIn: 3600 });
};

export const createDownloadPresignedUrl = ({ bucket, objectKey }: PresignedUrlParams) => {
  if (!bucket || !objectKey) {
    throw new Error('Bucket and objectKey are required');
  }
  const command = new GetObjectCommand({ Bucket: bucket, Key: objectKey });
  return getSignedUrl(getS3Client(), command, { expiresIn: 3600 });
};

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('error', err => reject(err));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

export async function downloadFromS3(key: string) {
  const awsBucketName = process.env.AWS_BUCKET_NAME;
  if (!awsBucketName) throw new Error('AWS_BUCKET_NAME environment variable is not set.');
  const command = new GetObjectCommand({
    Bucket: awsBucketName,
    Key: key,
  });
  const response = await getS3Client().send(command);
  const stream = response.Body as Readable;
  const buffer = await streamToBuffer(stream);

  return buffer;
}

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
    throw new Error(`Local file does not exist: ${localPath}`);
  }

  const fileBuffer = fs.readFileSync(localPath);

  const contentType = mime.lookup(localPath) || 'application/octet-stream';

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType,
  });

  await getS3Client().send(command);

  return {
    message: 'Upload to s3',
    key,
    ContentType: contentType,
  };
};

