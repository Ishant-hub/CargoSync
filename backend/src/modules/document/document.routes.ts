import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validate.middleware';
import {
  presignUploadSchema,
  registerDocumentSchema,
  getDocumentParamSchema,
  listDocumentsQuerySchema,
} from './document.schema';
import {
  presignUploadHandler,
  registerDocumentHandler,
  listDocumentsHandler,
  downloadDocumentHandler,
} from './document.controller';

const router = Router();

router.use(authenticate);

// Request presigned S3 upload URL with validation
router.post('/presign-upload', validateRequest(presignUploadSchema), presignUploadHandler);

// Register uploaded document metadata
router.post('/', validateRequest(registerDocumentSchema), registerDocumentHandler);

// List caller's or company documents
router.get('/', validateRequest(listDocumentsQuerySchema), listDocumentsHandler);

// Get presigned download URL for document
router.get('/:id/download', validateRequest(getDocumentParamSchema), downloadDocumentHandler);

export const documentRouter = router;
