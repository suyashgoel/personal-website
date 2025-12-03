import { Role } from '@personal-website/shared';

export type JWTPayload = {
  sub: number;
  role: Role;
};

export type ImageMetadata = {
  width: number;
  height: number;
  key: string;
};

export type UploadParams = {
  key: string;
  body: Buffer;
  contentType?: string;
};
