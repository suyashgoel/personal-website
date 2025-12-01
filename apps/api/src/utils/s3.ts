import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../clients/s3';
import { env } from '../config/env';
import { S3Error } from '../errors';
import { UploadParams } from '../types/upload';

export async function uploadFile({ key, body, contentType }: UploadParams) {
  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: env.S3_BUCKET_NAME,
        Key: key,
        Body: body,
        ContentType: contentType,
      })
    );
  } catch (err) {
    throw new S3Error(err);
  }
}

export async function deleteFile(key: string) {
  try {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: env.S3_BUCKET_NAME,
        Key: key,
      })
    );
  } catch (err) {
    throw new S3Error(err);
  }
}

export function getPublicUrl(key: string) {
  return `https://${env.S3_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;
}

export function getKeyFromUrl(url: string) {
  return url.split('/').pop()!;
}
