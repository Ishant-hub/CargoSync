import { prisma } from '../../config/prisma';
import { AppError } from '../../middlewares/error.middleware';
import { UpdateProfileInput } from './user.schema';

export async function getCurrentUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      accountType: true,
      verificationStatus: true,
      cityHub: true,
      avatarUrl: true,
      rating: true,
      createdAt: true,
      memberships: {
        include: {
          company: {
            select: {
              id: true,
              legalName: true,
              businessType: true,
              gstin: true,
              verificationStatus: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
}

export async function updateProfile(userId: string, input: UpdateProfileInput) {
  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(input.name ? { name: input.name } : {}),
      ...(input.cityHub !== undefined ? { cityHub: input.cityHub } : {}),
      ...(input.avatarUrl !== undefined ? { avatarUrl: input.avatarUrl } : {}),
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      accountType: true,
      verificationStatus: true,
      cityHub: true,
      avatarUrl: true,
      rating: true,
      createdAt: true,
    },
  });

  return updated;
}

export async function updateVerificationStatus(
  userId: string,
  status: 'PENDING' | 'VERIFIED' | 'CORRECTION_REQUIRED' | 'REJECTED'
) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { verificationStatus: status },
    select: {
      id: true,
      name: true,
      email: true,
      verificationStatus: true,
      updatedAt: true,
    },
  });

  return updated;
}
