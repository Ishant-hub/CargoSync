import { z } from 'zod';
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES } from '../../services/storage.service';

const documentTypeEnum = z.enum([
  'AADHAAR',
  'DRIVING_LICENCE',
  'PAN',
  'RC',
  'GST_CERTIFICATE',
  'INCORPORATION',
  'BANK_STATEMENT',
]);

const documentCategoryEnum = z.enum(['INDIVIDUAL', 'COMPANY']);

export const presignUploadSchema = z.object({
  body: z.object({
    category: documentCategoryEnum,
    type: documentTypeEnum,
    fileName: z.string().min(1, 'File name is required'),
    fileSize: z.number().int().positive().max(MAX_FILE_SIZE_BYTES, 'File size cannot exceed 10MB'),
    mimeType: z.string().refine((val) => ALLOWED_MIME_TYPES.includes(val.toLowerCase()), {
      message: `MIME type must be one of: ${ALLOWED_MIME_TYPES.join(', ')}`,
    }),
    companyId: z.string().uuid('Invalid company ID format').optional(),
  }),
});

export const registerDocumentSchema = z.object({
  body: z.object({
    category: documentCategoryEnum,
    type: documentTypeEnum,
    s3Key: z.string().min(1, 'S3 key is required'),
    fileName: z.string().min(1, 'File name is required'),
    fileSize: z.number().int().positive().max(MAX_FILE_SIZE_BYTES),
    mimeType: z.string().refine((val) => ALLOWED_MIME_TYPES.includes(val.toLowerCase())),
    companyId: z.string().uuid('Invalid company ID format').optional(),
  }),
});

export const getDocumentParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid document ID format'),
  }),
});

export const listDocumentsQuerySchema = z.object({
  query: z.object({
    category: documentCategoryEnum.optional(),
    companyId: z.string().uuid('Invalid company ID format').optional(),
  }),
});

export type PresignUploadInput = z.infer<typeof presignUploadSchema>['body'];
export type RegisterDocumentInput = z.infer<typeof registerDocumentSchema>['body'];
