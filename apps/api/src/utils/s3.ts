import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../clients';
import { env } from '../config';
import { S3Error } from '../errors';
import type { UploadParams } from '../types';

export async function uploadFile(params: UploadParams): Promise<void> {
  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: env.S3_BUCKET_NAME,
        Key: params.key,
        Body: params.body,
        ContentType: params.contentType,
      })
    );
  } catch (err) {
    throw new S3Error(err);
  }
}

export async function deleteFile(key: string): Promise<void> {
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

export function getPublicUrl(key: string): string {
  return `https://${env.S3_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;
}

export function getKeyFromUrl(url: string): string {
  return url.split('/').pop()!;
}
