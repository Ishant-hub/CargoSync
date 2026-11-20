import crypto from 'crypto';
import { prisma } from '../../config/prisma';
import { AppError } from '../../middlewares/error.middleware';
import { CreateInvitationInput } from './invitation.schema';

function generateInviteCode(): string {
  // Generate random 6-character uppercase alphanumeric code
  return crypto.randomBytes(4).toString('hex').slice(0, 6).toUpperCase();
}

export async function createInvitation(userId: string, input: CreateInvitationInput) {
  // Check authorization: user must be company owner or have admin membership
  const company = await prisma.company.findUnique({
    where: { id: input.companyId },
    include: {
      memberships: {
        where: { userId },
      },
    },
  });

  if (!company) {
    throw new AppError('Company not found', 404);
  }

  const isOwner = company.adminId === userId;
  const isAdminMember = company.memberships.some(
    (m) => m.role === 'ADMIN' && m.status === 'ACTIVE'
  );

  if (!isOwner && !isAdminMember) {
    throw new AppError('You do not have permission to invite members to this company', 403);
  }

  let code = generateInviteCode();
  // Ensure uniqueness
  let exists = await prisma.invitation.findUnique({ where: { code } });
  while (exists) {
    code = generateInviteCode();
    exists = await prisma.invitation.findUnique({ where: { code } });
  }

  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + input.expiresInHours);

  const invitation = await prisma.invitation.create({
    data: {
      code,
      companyId: input.companyId,
      role: input.role,
      createdById: userId,
      invitedEmail: input.invitedEmail?.toLowerCase(),
      expiresAt,
      used: false,
    },
    include: {
      company: {
        select: {
          legalName: true,
          verificationStatus: true,
        },
      },
    },
  });

  return invitation;
}

export async function verifyInvitation(code: string) {
  const invitation = await prisma.invitation.findUnique({
    where: { code: code.toUpperCase() },
    include: {
      company: {
        select: {
          id: true,
          legalName: true,
          businessType: true,
          verificationStatus: true,
        },
      },
    },
  });

  if (!invitation) {
    throw new AppError('Invalid invitation code', 404);
  }

  if (invitation.used) {
    throw new AppError('This invitation has already been used', 410);
  }

  if (new Date() > invitation.expiresAt) {
    throw new AppError('This invitation has expired', 410);
  }

  return {
    code: invitation.code,
    company: invitation.company,
    role: invitation.role,
    expiresAt: invitation.expiresAt,
    invitedEmail: invitation.invitedEmail,
  };
}

export async function acceptInvitation(userId: string, code: string) {
  const normalizedCode = code.toUpperCase();

  const invitation = await prisma.invitation.findUnique({
    where: { code: normalizedCode },
    include: {
      company: true,
    },
  });

  if (!invitation) {
    throw new AppError('Invalid invitation code', 404);
  }

  if (invitation.used) {
    throw new AppError('This invitation has already been used', 410);
  }

  if (new Date() > invitation.expiresAt) {
    throw new AppError('This invitation has expired', 410);
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (invitation.invitedEmail && invitation.invitedEmail !== user.email.toLowerCase()) {
    throw new AppError('This invitation was issued for a different email address', 403);
  }

  // Check if user is already an active member of this company
  const existingMembership = await prisma.companyMembership.findUnique({
    where: {
      userId_companyId: {
        userId,
        companyId: invitation.companyId,
      },
    },
  });

  if (existingMembership) {
    throw new AppError('You are already a member of this company', 409);
  }

  // Execute single-use consumption and membership creation atomically
  const result = await prisma.$transaction(async (tx) => {
    // 1. Mark invitation as used (ensures single-use guarantee)
    const updatedInvite = await tx.invitation.update({
      where: { id: invitation.id },
      data: {
        used: true,
        usedById: userId,
        usedAt: new Date(),
      },
    });

    // 2. Create company membership with role specified by invitation
    const membership = await tx.companyMembership.create({
      data: {
        userId,
        companyId: invitation.companyId,
        role: invitation.role,
        status: 'ACTIVE',
      },
      include: {
        company: true,
      },
    });

    // 3. Update user accountType to COMPANY if not already set
    // Note: Individual user verification status is unchanged (separate verification policy)
    let newSystemRole = user.role;
    if (invitation.role === 'DRIVER') {
      newSystemRole = 'DRIVER';
    } else if (invitation.role === 'FLEET_MANAGER') {
      newSystemRole = 'FLEET_MANAGER';
    } else if (invitation.role === 'ADMIN' && user.role !== 'COMPANY_ADMIN') {
      newSystemRole = 'COMPANY_ADMIN';
    }

    await tx.user.update({
      where: { id: userId },
      data: {
        accountType: 'COMPANY',
        role: newSystemRole,
      },
    });

    return { membership, updatedInvite };
  });

  return {
    success: true,
    message: `Successfully joined ${invitation.company.legalName}`,
    company: {
      id: invitation.company.id,
      legalName: invitation.company.legalName,
      companyRole: invitation.role,
    },
    membership: result.membership,
  };
}
