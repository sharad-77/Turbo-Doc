interface PresignedUrlParams {
  bucket: string;
  key: string;
}

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
dotenv.config({path: "../../.env"});

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.AWS_S3_REGION || 'us-east-1';

if (!accessKeyId || !secretAccessKey) {
  throw new Error("AWS credentials must be set in the .env file.");
}

// Initialize S3 Client
const s3Client = new S3Client({
  region: region,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
});


export const createPersignedUrlwithClient = ({ bucket, key }: PresignedUrlParams) => {
  if (!bucket || !key) {
    return console.log("provide bucket and key");
  }
  const command = new PutObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(s3Client, command, { expiresIn: 3600 });
}
