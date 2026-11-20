import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import path from 'path';
import { env } from '../config/env';
import { AppError } from '../middlewares/error.middleware';

export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
];

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export interface PresignedUploadResult {
  uploadUrl: string;
  s3Key: string;
  s3Bucket: string;
  expiresInSeconds: number;
  headers: Record<string, string>;
  isStorageConfigured: boolean;
}

export class StorageService {
  private s3Client: S3Client | null = null;
  public readonly isConfigured: boolean;

  constructor() {
    this.isConfigured = Boolean(
      env.AWS_ACCESS_KEY_ID &&
      env.AWS_SECRET_ACCESS_KEY &&
      env.AWS_BUCKET_NAME
    );

    if (this.isConfigured) {
      this.s3Client = new S3Client({
        region: env.AWS_REGION,
        credentials: {
          accessKeyId: env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: env.AWS_SECRET_ACCESS_KEY!,
        },
        endpoint: env.S3_ENDPOINT,
        forcePathStyle: Boolean(env.S3_ENDPOINT),
      });
    }
  }

  public validateFile(mimeType: string, fileSizeBytes?: number): void {
    if (!ALLOWED_MIME_TYPES.includes(mimeType.toLowerCase())) {
      throw new AppError(
        `Disallowed file type '${mimeType}'. Allowed types are: ${ALLOWED_MIME_TYPES.join(', ')}`,
        400
      );
    }

    if (fileSizeBytes !== undefined && fileSizeBytes > MAX_FILE_SIZE_BYTES) {
      throw new AppError(
        `File size (${(fileSizeBytes / 1024 / 1024).toFixed(2)} MB) exceeds maximum limit of 10 MB`,
        400
      );
    }
  }

  public generateKey(params: {
    category: 'INDIVIDUAL' | 'COMPANY';
    ownerId: string;
    docType: string;
    fileName: string;
  }): string {
    const ext = path.extname(params.fileName).toLowerCase() || '.bin';
    const folder = params.category === 'INDIVIDUAL' ? 'users' : 'companies';
    const uniqueId = randomUUID().slice(0, 8);
    const sanitizedType = params.docType.toLowerCase();

    return `documents/${folder}/${params.ownerId}/${sanitizedType}_${Date.now()}_${uniqueId}${ext}`;
  }

  public async getPresignedUploadUrl(params: {
    s3Key: string;
    mimeType: string;
    expiresInSeconds?: number;
  }): Promise<PresignedUploadResult> {
    const expiresIn = params.expiresInSeconds || 900; // 15 minutes

    if (!this.isConfigured || !this.s3Client) {
      // Local/mock fallback when AWS S3 credentials are not set in environment
      return {
        uploadUrl: `https://${env.AWS_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${params.s3Key}?mock_presigned_upload=true`,
        s3Key: params.s3Key,
        s3Bucket: env.AWS_BUCKET_NAME,
        expiresInSeconds: expiresIn,
        headers: {
          'Content-Type': params.mimeType,
        },
        isStorageConfigured: false,
      };
    }

    const command = new PutObjectCommand({
      Bucket: env.AWS_BUCKET_NAME,
      Key: params.s3Key,
      ContentType: params.mimeType,
    });

    const uploadUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn,
    });

    return {
      uploadUrl,
      s3Key: params.s3Key,
      s3Bucket: env.AWS_BUCKET_NAME,
      expiresInSeconds: expiresIn,
      headers: {
        'Content-Type': params.mimeType,
      },
      isStorageConfigured: true,
    };
  }

  public async getPresignedDownloadUrl(params: {
    s3Key: string;
    expiresInSeconds?: number;
  }): Promise<{ downloadUrl: string; expiresInSeconds: number; isStorageConfigured: boolean }> {
    const expiresIn = params.expiresInSeconds || 900; // 15 minutes

    if (!this.isConfigured || !this.s3Client) {
      return {
        downloadUrl: `https://${env.AWS_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${params.s3Key}?mock_presigned_download=true`,
        expiresInSeconds: expiresIn,
        isStorageConfigured: false,
      };
    }

    const command = new GetObjectCommand({
      Bucket: env.AWS_BUCKET_NAME,
      Key: params.s3Key,
    });

    const downloadUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn,
    });

    return {
      downloadUrl,
      expiresInSeconds: expiresIn,
      isStorageConfigured: true,
    };
  }
}

export const storageService = new StorageService();
