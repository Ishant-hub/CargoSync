import { prisma } from '../../config/prisma';
import { hashPassword, verifyPassword } from '../../utils/password';
import { signToken } from '../../utils/jwt';
import { AppError } from '../../middlewares/error.middleware';
import { RegisterInput, LoginInput } from './auth.schema';

export async function register(input: RegisterInput) {
  const existing = await prisma.user.findFirst({
    where: {
      OR: [
        { email: input.email.toLowerCase() },
        { phone: input.phone },
      ],
    },
  });

  if (existing) {
    if (existing.email === input.email.toLowerCase()) {
      throw new AppError('A user with this email already exists', 409);
    }
    throw new AppError('A user with this phone number already exists', 409);
  }

  const passwordHash = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email.toLowerCase(),
      phone: input.phone,
      passwordHash,
      role: input.role,
      accountType: input.accountType,
      cityHub: input.cityHub,
      verificationStatus: 'NOT_SUBMITTED',
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

  const token = signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    accountType: user.accountType,
  });

  return { user, token };
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
    include: {
      memberships: {
        include: { company: true },
        take: 1,
      },
    },
  });

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isValid = await verifyPassword(user.passwordHash, input.password);
  if (!isValid) {
    throw new AppError('Invalid email or password', 401);
  }

  const primaryMembership = user.memberships[0];

  const token = signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    accountType: user.accountType,
    companyId: primaryMembership?.companyId ?? null,
    companyRole: primaryMembership?.role ?? null,
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      accountType: user.accountType,
      verificationStatus: user.verificationStatus,
      cityHub: user.cityHub,
      avatarUrl: user.avatarUrl,
      rating: user.rating,
      createdAt: user.createdAt,
      company: primaryMembership
        ? {
            id: primaryMembership.company.id,
            legalName: primaryMembership.company.legalName,
            role: primaryMembership.role,
            verificationStatus: primaryMembership.company.verificationStatus,
          }
        : null,
    },
    token,
  };
}
