import { prisma } from '../../config/prisma';
import { storageService } from '../../services/storage.service';
import { AppError } from '../../middlewares/error.middleware';
import { PresignUploadInput, RegisterDocumentInput } from './document.schema';
import { ROLE_DOCUMENT_REQUIREMENTS } from './document.requirements';
import { env } from '../../config/env';

export async function requestPresignedUpload(
  user: { userId: string; role: string },
  input: PresignUploadInput
) {
  // Validate file metadata
  storageService.validateFile(input.mimeType, input.fileSize);

  let ownerId = user.userId;

  if (input.category === 'INDIVIDUAL') {
    // Role-specific validation: Shippers must NOT upload driving licence
    const roleReqs = ROLE_DOCUMENT_REQUIREMENTS[user.role];
    if (roleReqs?.disallowed?.includes(input.type as any)) {
      throw new AppError(
        `Role ${user.role} is not permitted to upload document type ${input.type}. ${roleReqs.description}`,
        400
      );
    }
  } else {
    // Company document
    if (!input.companyId) {
      throw new AppError('companyId is required for company category documents', 400);
    }

    // Verify caller is admin/owner of company or PLATFORM_ADMIN
    if (user.role !== 'PLATFORM_ADMIN') {
      const company = await prisma.company.findUnique({
        where: { id: input.companyId },
        include: {
          memberships: {
            where: { userId: user.userId, role: 'ADMIN', status: 'ACTIVE' },
          },
        },
      });

      if (!company || (company.adminId !== user.userId && company.memberships.length === 0)) {
        throw new AppError('You are not authorized to upload documents for this company', 403);
      }
    }

    ownerId = input.companyId;
  }

  const s3Key = storageService.generateKey({
    category: input.category,
    ownerId,
    docType: input.type,
    fileName: input.fileName,
  });

  const presigned = await storageService.getPresignedUploadUrl({
    s3Key,
    mimeType: input.mimeType,
  });

  return presigned;
}

export async function registerDocument(
  user: { userId: string; role: string },
  input: RegisterDocumentInput
) {
  storageService.validateFile(input.mimeType, input.fileSize);

  if (input.category === 'INDIVIDUAL') {
    // Role-specific check
    const roleReqs = ROLE_DOCUMENT_REQUIREMENTS[user.role];
    if (roleReqs?.disallowed?.includes(input.type as any)) {
      throw new AppError(
        `Role ${user.role} is not permitted to register document type ${input.type}`,
        400
      );
    }

    // Check for existing document of this type to handle versioning / replacement
    const existing = await prisma.verificationDocument.findFirst({
      where: {
        userId: user.userId,
        type: input.type,
        category: 'INDIVIDUAL',
      },
      orderBy: { version: 'desc' },
    });

    const version = existing ? existing.version + 1 : 1;

    const doc = await prisma.verificationDocument.create({
      data: {
        category: 'INDIVIDUAL',
        type: input.type,
        s3Key: input.s3Key,
        s3Bucket: env.AWS_BUCKET_NAME,
        fileName: input.fileName,
        fileSize: input.fileSize,
        mimeType: input.mimeType,
        status: 'SUBMITTED',
        version,
        userId: user.userId,
        uploadedById: user.userId,
      },
    });

    return doc;
  } else {
    // Company category
    if (!input.companyId) {
      throw new AppError('companyId is required for company documents', 400);
    }

    if (user.role !== 'PLATFORM_ADMIN') {
      const company = await prisma.company.findUnique({
        where: { id: input.companyId },
        include: {
          memberships: {
            where: { userId: user.userId, role: 'ADMIN', status: 'ACTIVE' },
          },
        },
      });

      if (!company || (company.adminId !== user.userId && company.memberships.length === 0)) {
        throw new AppError('Not authorized to register documents for this company', 403);
      }
    }

    const existing = await prisma.verificationDocument.findFirst({
      where: {
        companyId: input.companyId,
        type: input.type,
        category: 'COMPANY',
      },
      orderBy: { version: 'desc' },
    });

    const version = existing ? existing.version + 1 : 1;

    const doc = await prisma.verificationDocument.create({
      data: {
        category: 'COMPANY',
        type: input.type,
        s3Key: input.s3Key,
        s3Bucket: env.AWS_BUCKET_NAME,
        fileName: input.fileName,
        fileSize: input.fileSize,
        mimeType: input.mimeType,
        status: 'SUBMITTED',
        version,
        companyId: input.companyId,
        uploadedById: user.userId,
      },
    });

    return doc;
  }
}

export async function listUserDocuments(userId: string) {
  return prisma.verificationDocument.findMany({
    where: { userId, category: 'INDIVIDUAL' },
    orderBy: { createdAt: 'desc' },
  });
}

export async function listCompanyDocuments(userId: string, companyId: string, userRole: string) {
  // Check membership or platform admin
  if (userRole !== 'PLATFORM_ADMIN') {
    const membership = await prisma.companyMembership.findUnique({
      where: { userId_companyId: { userId, companyId } },
    });
    const company = await prisma.company.findUnique({ where: { id: companyId } });
    if (!membership && company?.adminId !== userId) {
      throw new AppError('Not authorized to view documents for this company', 403);
    }
  }

  return prisma.verificationDocument.findMany({
    where: { companyId, category: 'COMPANY' },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getDocumentDownloadUrl(
  user: { userId: string; role: string },
  documentId: string
) {
  const doc = await prisma.verificationDocument.findUnique({
    where: { id: documentId },
  });

  if (!doc) {
    throw new AppError('Document not found', 404);
  }

  // Authorization check
  const isPlatformAdmin = user.role === 'PLATFORM_ADMIN';
  const isOwner = doc.userId === user.userId || doc.uploadedById === user.userId;

  let isCompanyAdmin = false;
  if (doc.companyId) {
    const comp = await prisma.company.findUnique({
      where: { id: doc.companyId },
      include: {
        memberships: {
          where: { userId: user.userId, role: 'ADMIN', status: 'ACTIVE' },
        },
      },
    });
    isCompanyAdmin = Boolean(comp && (comp.adminId === user.userId || comp.memberships.length > 0));
  }

  if (!isPlatformAdmin && !isOwner && !isCompanyAdmin) {
    throw new AppError('You do not have permission to access this document', 403);
  }

  const { downloadUrl, expiresInSeconds, isStorageConfigured } =
    await storageService.getPresignedDownloadUrl({
      s3Key: doc.s3Key,
    });

  return {
    documentId: doc.id,
    fileName: doc.fileName,
    type: doc.type,
    status: doc.status,
    downloadUrl,
    expiresInSeconds,
    isStorageConfigured,
  };
}
