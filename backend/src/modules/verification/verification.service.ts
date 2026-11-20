import { prisma } from '../../config/prisma';
import { AppError } from '../../middlewares/error.middleware';
import {
  validateDocumentSubmissionForRole,
  validateCompanyDocumentSubmission,
  ROLE_DOCUMENT_REQUIREMENTS,
  COMPANY_DOCUMENT_REQUIREMENTS,
} from '../document/document.requirements';
import { VerificationDecisionInput } from './verification.schema';

export async function submitUserKYC(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      verificationDocs: {
        where: { category: 'INDIVIDUAL' },
      },
    },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (user.verificationStatus === 'VERIFIED') {
    throw new AppError('Your account is already verified', 400);
  }

  if (user.verificationStatus === 'PENDING' || user.verificationStatus === 'UNDER_REVIEW') {
    throw new AppError('Verification is already submitted and pending review', 400);
  }

  // Validate documents against role-specific requirements
  const docTypes = user.verificationDocs.map((d) => d.type);
  const validation = validateDocumentSubmissionForRole(user.role, docTypes);

  if (!validation.isValid) {
    throw new AppError(
      `Document submission requirements not met: ${validation.missingRequirements.join('; ')}`,
      400,
      validation.missingRequirements
    );
  }

  const previousStatus = user.verificationStatus;

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: { verificationStatus: 'PENDING' },
    });

    await tx.verificationAuditLog.create({
      data: {
        entityType: 'INDIVIDUAL',
        entityId: userId,
        previousStatus,
        newStatus: 'PENDING',
        remarks: 'Documents submitted by user for verification',
        performedById: userId,
      },
    });
  });

  return {
    success: true,
    message: 'KYC documents submitted for manual review',
    status: 'PENDING',
  };
}

export async function submitCompanyVerification(userId: string, companyId: string) {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: {
      memberships: {
        where: { userId, role: 'ADMIN', status: 'ACTIVE' },
      },
      verificationDocs: {
        where: { category: 'COMPANY' },
      },
    },
  });

  if (!company) {
    throw new AppError('Company not found', 404);
  }

  if (company.adminId !== userId && company.memberships.length === 0) {
    throw new AppError('You do not have permission to submit verification for this company', 403);
  }

  if (company.verificationStatus === 'VERIFIED') {
    throw new AppError('Company is already verified', 400);
  }

  if (company.verificationStatus === 'PENDING' || company.verificationStatus === 'UNDER_REVIEW') {
    throw new AppError('Company verification is already submitted and pending review', 400);
  }

  const docTypes = company.verificationDocs.map((d) => d.type);
  const validation = validateCompanyDocumentSubmission(docTypes);

  if (!validation.isValid) {
    throw new AppError(
      `Company verification requirements not met: ${validation.missingRequirements.join('; ')}`,
      400,
      validation.missingRequirements
    );
  }

  const previousStatus = company.verificationStatus;

  await prisma.$transaction(async (tx) => {
    await tx.company.update({
      where: { id: companyId },
      data: { verificationStatus: 'PENDING' },
    });

    await tx.verificationAuditLog.create({
      data: {
        entityType: 'COMPANY',
        entityId: companyId,
        previousStatus,
        newStatus: 'PENDING',
        remarks: 'Company statutory documents submitted for verification',
        performedById: userId,
      },
    });
  });

  return {
    success: true,
    message: 'Company statutory documents submitted for manual audit',
    status: 'PENDING',
  };
}

export async function getUserVerificationStatus(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      verificationDocs: {
        where: { category: 'INDIVIDUAL' },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const auditHistory = await prisma.verificationAuditLog.findMany({
    where: { entityType: 'INDIVIDUAL', entityId: userId },
    orderBy: { createdAt: 'desc' },
  });

  const roleReqs = ROLE_DOCUMENT_REQUIREMENTS[user.role];

  return {
    userId: user.id,
    name: user.name,
    role: user.role,
    verificationStatus: user.verificationStatus,
    requirements: roleReqs,
    documents: user.verificationDocs,
    auditHistory,
  };
}

export async function getCompanyVerificationStatus(userId: string, companyId: string, userRole: string) {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: {
      verificationDocs: {
        where: { category: 'COMPANY' },
        orderBy: { createdAt: 'desc' },
      },
      memberships: {
        where: { userId },
      },
    },
  });

  if (!company) {
    throw new AppError('Company not found', 404);
  }

  if (userRole !== 'PLATFORM_ADMIN' && company.adminId !== userId && company.memberships.length === 0) {
    throw new AppError('You do not have permission to view verification status for this company', 403);
  }

  const auditHistory = await prisma.verificationAuditLog.findMany({
    where: { entityType: 'COMPANY', entityId: companyId },
    orderBy: { createdAt: 'desc' },
  });

  return {
    companyId: company.id,
    legalName: company.legalName,
    gstin: company.gstin,
    verificationStatus: company.verificationStatus,
    requirements: COMPANY_DOCUMENT_REQUIREMENTS,
    documents: company.verificationDocs,
    auditHistory,
  };
}

export async function listPendingReviews() {
  const pendingUsers = await prisma.user.findMany({
    where: {
      verificationStatus: { in: ['PENDING', 'UNDER_REVIEW'] },
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      verificationStatus: true,
      createdAt: true,
      verificationDocs: {
        where: { category: 'INDIVIDUAL' },
      },
    },
    orderBy: { createdAt: 'asc' },
  });

  const pendingCompanies = await prisma.company.findMany({
    where: {
      verificationStatus: { in: ['PENDING', 'UNDER_REVIEW'] },
    },
    select: {
      id: true,
      legalName: true,
      gstin: true,
      businessType: true,
      verificationStatus: true,
      createdAt: true,
      admin: {
        select: { id: true, name: true, email: true },
      },
      verificationDocs: {
        where: { category: 'COMPANY' },
      },
    },
    orderBy: { createdAt: 'asc' },
  });

  return {
    users: pendingUsers,
    companies: pendingCompanies,
  };
}

export async function startReview(
  adminId: string,
  entityType: 'INDIVIDUAL' | 'COMPANY',
  entityId: string
) {
  if (entityType === 'INDIVIDUAL') {
    const user = await prisma.user.findUnique({ where: { id: entityId } });
    if (!user) throw new AppError('User not found', 404);

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: entityId },
        data: { verificationStatus: 'UNDER_REVIEW' },
      });
      await tx.verificationAuditLog.create({
        data: {
          entityType: 'INDIVIDUAL',
          entityId,
          previousStatus: user.verificationStatus,
          newStatus: 'UNDER_REVIEW',
          remarks: 'Review commenced by Platform Administrator',
          performedById: adminId,
        },
      });
    });

    return { success: true, status: 'UNDER_REVIEW' };
  } else {
    const company = await prisma.company.findUnique({ where: { id: entityId } });
    if (!company) throw new AppError('Company not found', 404);

    await prisma.$transaction(async (tx) => {
      await tx.company.update({
        where: { id: entityId },
        data: { verificationStatus: 'UNDER_REVIEW' },
      });
      await tx.verificationAuditLog.create({
        data: {
          entityType: 'COMPANY',
          entityId,
          previousStatus: company.verificationStatus,
          newStatus: 'UNDER_REVIEW',
          remarks: 'Company audit commenced by Platform Administrator',
          performedById: adminId,
        },
      });
    });

    return { success: true, status: 'UNDER_REVIEW' };
  }
}

export async function reviewUserDecision(
  adminId: string,
  targetUserId: string,
  input: VerificationDecisionInput
) {
  const user = await prisma.user.findUnique({ where: { id: targetUserId } });
  if (!user) throw new AppError('User not found', 404);

  const previousStatus = user.verificationStatus;

  await prisma.$transaction(async (tx) => {
    // 1. Update user verification status
    await tx.user.update({
      where: { id: targetUserId },
      data: { verificationStatus: input.status },
    });

    // 2. Update individual documents if specified
    if (input.documentDecisions && input.documentDecisions.length > 0) {
      for (const d of input.documentDecisions) {
        await tx.verificationDocument.update({
          where: { id: d.documentId },
          data: {
            status: d.status,
            reviewRemarks: d.remarks || input.remarks,
            reviewedById: adminId,
            reviewedAt: new Date(),
          },
        });
      }
    }

    // 3. Log audit event
    await tx.verificationAuditLog.create({
      data: {
        entityType: 'INDIVIDUAL',
        entityId: targetUserId,
        previousStatus,
        newStatus: input.status,
        remarks: input.remarks || `Audit decision: ${input.status}`,
        performedById: adminId,
      },
    });
  });

  return {
    success: true,
    message: `User verification updated to ${input.status}`,
    userId: targetUserId,
    status: input.status,
  };
}

export async function reviewCompanyDecision(
  adminId: string,
  companyId: string,
  input: VerificationDecisionInput
) {
  const company = await prisma.company.findUnique({ where: { id: companyId } });
  if (!company) throw new AppError('Company not found', 404);

  const previousStatus = company.verificationStatus;

  // IMPORTANT: Company approval DOES NOT automatically verify employees.
  // Only company.verificationStatus is updated; employee records are strictly untouched.
  await prisma.$transaction(async (tx) => {
    await tx.company.update({
      where: { id: companyId },
      data: { verificationStatus: input.status },
    });

    if (input.documentDecisions && input.documentDecisions.length > 0) {
      for (const d of input.documentDecisions) {
        await tx.verificationDocument.update({
          where: { id: d.documentId },
          data: {
            status: d.status,
            reviewRemarks: d.remarks || input.remarks,
            reviewedById: adminId,
            reviewedAt: new Date(),
          },
        });
      }
    }

    await tx.verificationAuditLog.create({
      data: {
        entityType: 'COMPANY',
        entityId: companyId,
        previousStatus,
        newStatus: input.status,
        remarks: input.remarks || `Company audit decision: ${input.status}`,
        performedById: adminId,
      },
    });
  });

  return {
    success: true,
    message: `Company verification updated to ${input.status}`,
    companyId,
    status: input.status,
  };
}

export async function resubmitUserKYC(userId: string, notes?: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      verificationDocs: { where: { category: 'INDIVIDUAL' } },
    },
  });

  if (!user) throw new AppError('User not found', 404);

  if (user.verificationStatus !== 'CORRECTION_REQUIRED') {
    throw new AppError(
      `Cannot resubmit KYC from current status '${user.verificationStatus}'. Resubmission is only permitted when status is CORRECTION_REQUIRED.`,
      400
    );
  }

  const previousStatus = user.verificationStatus;

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: { verificationStatus: 'PENDING' },
    });

    await tx.verificationAuditLog.create({
      data: {
        entityType: 'INDIVIDUAL',
        entityId: userId,
        previousStatus,
        newStatus: 'PENDING',
        remarks: notes ? `Resubmission: ${notes}` : 'Resubmitted after corrections',
        performedById: userId,
      },
    });
  });

  return {
    success: true,
    message: 'KYC resubmitted successfully for review',
    status: 'PENDING',
  };
}

export async function resubmitCompanyVerification(userId: string, companyId: string, notes?: string) {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: {
      memberships: { where: { userId, role: 'ADMIN', status: 'ACTIVE' } },
    },
  });

  if (!company) throw new AppError('Company not found', 404);

  if (company.adminId !== userId && company.memberships.length === 0) {
    throw new AppError('Not authorized to resubmit verification for this company', 403);
  }

  if (company.verificationStatus !== 'CORRECTION_REQUIRED') {
    throw new AppError(
      `Cannot resubmit company verification from current status '${company.verificationStatus}'. Only allowed when status is CORRECTION_REQUIRED.`,
      400
    );
  }

  const previousStatus = company.verificationStatus;

  await prisma.$transaction(async (tx) => {
    await tx.company.update({
      where: { id: companyId },
      data: { verificationStatus: 'PENDING' },
    });

    await tx.verificationAuditLog.create({
      data: {
        entityType: 'COMPANY',
        entityId: companyId,
        previousStatus,
        newStatus: 'PENDING',
        remarks: notes ? `Company resubmission: ${notes}` : 'Company resubmitted after corrections',
        performedById: userId,
      },
    });
  });

  return {
    success: true,
    message: 'Company verification resubmitted successfully for review',
    status: 'PENDING',
  };
}
