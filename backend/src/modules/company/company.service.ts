import { prisma } from '../../config/prisma';
import { AppError } from '../../middlewares/error.middleware';
import { CreateCompanyInput } from './company.schema';

export async function createCompany(adminId: string, input: CreateCompanyInput) {
  const existingGstin = await prisma.company.findUnique({
    where: { gstin: input.gstin.toUpperCase() },
  });

  if (existingGstin) {
    throw new AppError('A company with this GSTIN is already registered', 409);
  }

  // Create company and assign admin as owner
  const company = await prisma.$transaction(async (tx) => {
    const newCompany = await tx.company.create({
      data: {
        legalName: input.legalName,
        businessType: input.businessType,
        gstin: input.gstin.toUpperCase(),
        registeredAddress: input.registeredAddress,
        fleetSize: input.fleetSize,
        adminId,
        verificationStatus: 'NOT_SUBMITTED',
      },
    });

    // Create owner membership
    await tx.companyMembership.create({
      data: {
        userId: adminId,
        companyId: newCompany.id,
        role: 'ADMIN',
        status: 'ACTIVE',
      },
    });

    // Upgrade user account
    await tx.user.update({
      where: { id: adminId },
      data: {
        role: 'COMPANY_ADMIN',
        accountType: 'COMPANY',
      },
    });

    return newCompany;
  });

  return company;
}

export async function getCompanyById(companyId: string) {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: {
      admin: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          verificationStatus: true,
        },
      },
      _count: {
        select: {
          memberships: true,
          invitations: true,
        },
      },
    },
  });

  if (!company) {
    throw new AppError('Company not found', 404);
  }

  return company;
}

export async function getCompanyTeam(companyId: string) {
  const memberships = await prisma.companyMembership.findMany({
    where: { companyId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          verificationStatus: true, // Note: Individual verification status is separate from company verification
          avatarUrl: true,
          createdAt: true,
        },
      },
    },
    orderBy: { joinedAt: 'asc' },
  });

  return memberships.map((m) => ({
    id: m.id,
    userId: m.user.id,
    name: m.user.name,
    email: m.user.email,
    phone: m.user.phone,
    systemRole: m.user.role,
    companyRole: m.role,
    membershipStatus: m.status,
    individualVerificationStatus: m.user.verificationStatus,
    joinedAt: m.joinedAt,
  }));
}

export async function updateCompanyVerification(
  companyId: string,
  status: 'PENDING' | 'VERIFIED' | 'CORRECTION_REQUIRED' | 'REJECTED'
) {
  const company = await prisma.company.findUnique({ where: { id: companyId } });
  if (!company) {
    throw new AppError('Company not found', 404);
  }

  // Note: Company verification status update does NOT modify employee individual verification statuses
  const updated = await prisma.company.update({
    where: { id: companyId },
    data: { verificationStatus: status },
  });

  return updated;
}
