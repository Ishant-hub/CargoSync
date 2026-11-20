import { vi } from 'vitest';
import { randomUUID } from 'crypto';

export interface MockUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: 'SHIPPER' | 'DRIVER' | 'FLEET_MANAGER' | 'COMPANY_ADMIN' | 'PLATFORM_ADMIN';
  accountType: 'INDIVIDUAL' | 'COMPANY';
  verificationStatus: 'NOT_SUBMITTED' | 'PENDING' | 'UNDER_REVIEW' | 'VERIFIED' | 'CORRECTION_REQUIRED' | 'REJECTED';
  cityHub?: string | null;
  avatarUrl?: string | null;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockCompany {
  id: string;
  legalName: string;
  businessType: string;
  gstin: string;
  registeredAddress: string;
  fleetSize?: number | null;
  adminId: string;
  verificationStatus: 'NOT_SUBMITTED' | 'PENDING' | 'UNDER_REVIEW' | 'VERIFIED' | 'CORRECTION_REQUIRED' | 'REJECTED';
  createdAt: Date;
  updatedAt: Date;
}

export interface MockMembership {
  id: string;
  userId: string;
  companyId: string;
  role: 'ADMIN' | 'DISPATCHER' | 'FLEET_MANAGER' | 'DRIVER' | 'MEMBER';
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  joinedAt: Date;
  updatedAt: Date;
}

export interface MockInvitation {
  id: string;
  code: string;
  companyId: string;
  role: 'ADMIN' | 'DISPATCHER' | 'FLEET_MANAGER' | 'DRIVER' | 'MEMBER';
  createdById: string;
  invitedEmail?: string | null;
  expiresAt: Date;
  used: boolean;
  usedById?: string | null;
  usedAt?: Date | null;
  createdAt: Date;
}

export interface MockVerificationDocument {
  id: string;
  category: 'INDIVIDUAL' | 'COMPANY';
  type: string;
  s3Key: string;
  s3Bucket: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  status: 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'CORRECTION_REQUIRED';
  version: number;
  reviewRemarks?: string | null;
  reviewedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  userId?: string | null;
  companyId?: string | null;
  uploadedById: string;
  reviewedById?: string | null;
}

export interface MockVerificationAuditLog {
  id: string;
  entityType: 'INDIVIDUAL' | 'COMPANY';
  entityId: string;
  previousStatus: string;
  newStatus: string;
  remarks?: string | null;
  performedById: string;
  createdAt: Date;
}

export function createMockPrisma() {
  const users: MockUser[] = [];
  const companies: MockCompany[] = [];
  const memberships: MockMembership[] = [];
  const invitations: MockInvitation[] = [];
  const verificationDocs: MockVerificationDocument[] = [];
  const auditLogs: MockVerificationAuditLog[] = [];

  const mock = {
    users,
    companies,
    memberships,
    invitations,
    verificationDocs,
    auditLogs,
    user: {
      findFirst: vi.fn(async ({ where }: { where: { OR?: Array<{ email?: string; phone?: string }> } }) => {
        if (where?.OR) {
          return users.find((u) =>
            where.OR!.some(
              (cond) =>
                (cond.email && u.email === cond.email) ||
                (cond.phone && u.phone === cond.phone)
            )
          ) || null;
        }
        return null;
      }),
      findUnique: vi.fn(async ({ where, include }: { where: { id?: string; email?: string }; include?: any }) => {
        const u = users.find((x) => (where.id && x.id === where.id) || (where.email && x.email === where.email));
        if (!u) return null;
        const res: any = { ...u };
        if (include?.memberships) {
          res.memberships = memberships
            .filter((m) => m.userId === u.id)
            .map((m) => {
              const comp = companies.find((c) => c.id === m.companyId);
              return { ...m, company: comp };
            });
        }
        if (include?.verificationDocs) {
          res.verificationDocs = verificationDocs.filter(
            (d) =>
              d.userId === u.id &&
              (!include.verificationDocs.where?.category || d.category === include.verificationDocs.where.category)
          );
        }
        return res;
      }),
      findMany: vi.fn(async ({ where, include, select }: { where?: any; include?: any; select?: any }) => {
        let list = [...users];
        if (where?.verificationStatus?.in) {
          list = list.filter((u) => where.verificationStatus.in.includes(u.verificationStatus));
        }
        return list.map((u) => {
          const docs = verificationDocs.filter((d) => d.userId === u.id && d.category === 'INDIVIDUAL');
          if (select) {
            return {
              id: u.id,
              name: u.name,
              email: u.email,
              phone: u.phone,
              role: u.role,
              verificationStatus: u.verificationStatus,
              createdAt: u.createdAt,
              verificationDocs: docs,
            };
          }
          return { ...u, verificationDocs: docs };
        });
      }),
      create: vi.fn(async ({ data, select }: { data: any; select?: any }) => {
        const newUser: MockUser = {
          id: randomUUID(),
          name: data.name,
          email: data.email,
          phone: data.phone,
          passwordHash: data.passwordHash,
          role: data.role || 'SHIPPER',
          accountType: data.accountType || 'INDIVIDUAL',
          verificationStatus: data.verificationStatus || 'NOT_SUBMITTED',
          cityHub: data.cityHub || null,
          avatarUrl: data.avatarUrl || null,
          rating: 5.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        users.push(newUser);
        if (select) {
          const result: any = {};
          for (const key of Object.keys(select)) {
            if (select[key]) {
              result[key] = (newUser as any)[key];
            }
          }
          return result;
        }
        return newUser;
      }),
      update: vi.fn(async ({ where, data }: { where: { id: string }; data: any }) => {
        const idx = users.findIndex((u) => u.id === where.id);
        if (idx === -1) throw new Error('User not found');
        users[idx] = { ...users[idx], ...data, updatedAt: new Date() };
        return users[idx];
      }),
    },
    company: {
      findUnique: vi.fn(async ({ where, include }: { where: { id?: string; gstin?: string }; include?: any }) => {
        const c = companies.find((x) => (where.id && x.id === where.id) || (where.gstin && x.gstin === where.gstin));
        if (!c) return null;
        const res: any = { ...c };
        if (include) {
          const admin = users.find((u) => u.id === c.adminId);
          const compMemberships = memberships.filter((m) => m.companyId === c.id);
          const compInvites = invitations.filter((i) => i.companyId === c.id);
          const docs = verificationDocs.filter((d) => d.companyId === c.id);
          res.admin = admin;
          if (include.memberships) {
            res.memberships = include.memberships.where?.userId
              ? compMemberships.filter((m) => m.userId === include.memberships.where.userId)
              : compMemberships;
          }
          if (include.verificationDocs) {
            res.verificationDocs = docs;
          }
          res._count = {
            memberships: compMemberships.length,
            invitations: compInvites.length,
          };
        }
        return res;
      }),
      findMany: vi.fn(async ({ where, select }: { where?: any; select?: any }) => {
        let list = [...companies];
        if (where?.verificationStatus?.in) {
          list = list.filter((c) => where.verificationStatus.in.includes(c.verificationStatus));
        }
        return list.map((c) => {
          const admin = users.find((u) => u.id === c.adminId);
          const docs = verificationDocs.filter((d) => d.companyId === c.id && d.category === 'COMPANY');
          if (select) {
            return {
              id: c.id,
              legalName: c.legalName,
              gstin: c.gstin,
              businessType: c.businessType,
              verificationStatus: c.verificationStatus,
              createdAt: c.createdAt,
              admin: admin ? { id: admin.id, name: admin.name, email: admin.email } : null,
              verificationDocs: docs,
            };
          }
          return { ...c, admin, verificationDocs: docs };
        });
      }),
      create: vi.fn(async ({ data }: { data: any }) => {
        const newComp: MockCompany = {
          id: randomUUID(),
          legalName: data.legalName,
          businessType: data.businessType,
          gstin: data.gstin,
          registeredAddress: data.registeredAddress,
          fleetSize: data.fleetSize || null,
          adminId: data.adminId,
          verificationStatus: data.verificationStatus || 'NOT_SUBMITTED',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        companies.push(newComp);
        return newComp;
      }),
      update: vi.fn(async ({ where, data }: { where: { id: string }; data: any }) => {
        const idx = companies.findIndex((c) => c.id === where.id);
        if (idx === -1) throw new Error('Company not found');
        companies[idx] = { ...companies[idx], ...data, updatedAt: new Date() };
        return companies[idx];
      }),
    },
    companyMembership: {
      findUnique: vi.fn(async ({ where }: { where: { userId_companyId?: { userId: string; companyId: string } } }) => {
        if (where.userId_companyId) {
          const m = memberships.find(
            (x) => x.userId === where.userId_companyId!.userId && x.companyId === where.userId_companyId!.companyId
          );
          return m ? { ...m } : null;
        }
        return null;
      }),
      findMany: vi.fn(async ({ where, include }: { where: { companyId?: string; userId?: string }; include?: any }) => {
        return memberships
          .filter((m) => (!where.companyId || m.companyId === where.companyId) && (!where.userId || m.userId === where.userId))
          .map((m) => {
            if (include?.user) {
              const u = users.find((x) => x.id === m.userId);
              return { ...m, user: u };
            }
            return { ...m };
          });
      }),
      create: vi.fn(async ({ data, include }: { data: any; include?: any }) => {
        const newMem: MockMembership = {
          id: randomUUID(),
          userId: data.userId,
          companyId: data.companyId,
          role: data.role || 'MEMBER',
          status: data.status || 'ACTIVE',
          joinedAt: new Date(),
          updatedAt: new Date(),
        };
        memberships.push(newMem);
        if (include?.company) {
          const comp = companies.find((c) => c.id === newMem.companyId);
          return { ...newMem, company: comp };
        }
        return newMem;
      }),
    },
    invitation: {
      findUnique: vi.fn(async ({ where, include }: { where: { id?: string; code?: string }; include?: any }) => {
        const inv = invitations.find((i) => (where.id && i.id === where.id) || (where.code && i.code === where.code));
        if (!inv) return null;
        if (include?.company) {
          const comp = companies.find((c) => c.id === inv.companyId);
          return { ...inv, company: comp };
        }
        return { ...inv };
      }),
      create: vi.fn(async ({ data, include }: { data: any; include?: any }) => {
        const newInv: MockInvitation = {
          id: randomUUID(),
          code: data.code,
          companyId: data.companyId,
          role: data.role,
          createdById: data.createdById,
          invitedEmail: data.invitedEmail || null,
          expiresAt: data.expiresAt,
          used: data.used || false,
          usedById: null,
          usedAt: null,
          createdAt: new Date(),
        };
        invitations.push(newInv);
        if (include?.company) {
          const comp = companies.find((c) => c.id === newInv.companyId);
          return { ...newInv, company: comp };
        }
        return newInv;
      }),
      update: vi.fn(async ({ where, data }: { where: { id: string }; data: any }) => {
        const idx = invitations.findIndex((i) => i.id === where.id);
        if (idx === -1) throw new Error('Invitation not found');
        invitations[idx] = { ...invitations[idx], ...data };
        return invitations[idx];
      }),
    },
    verificationDocument: {
      findUnique: vi.fn(async ({ where }: { where: { id?: string; s3Key?: string } }) => {
        const doc = verificationDocs.find(
          (d) => (where.id && d.id === where.id) || (where.s3Key && d.s3Key === where.s3Key)
        );
        return doc ? { ...doc } : null;
      }),
      findFirst: vi.fn(async ({ where, orderBy }: { where: any; orderBy?: any }) => {
        let matches = verificationDocs.filter((d) => {
          if (where.userId && d.userId !== where.userId) return false;
          if (where.companyId && d.companyId !== where.companyId) return false;
          if (where.type && d.type !== where.type) return false;
          if (where.category && d.category !== where.category) return false;
          return true;
        });
        if (orderBy?.version === 'desc') {
          matches = matches.sort((a, b) => b.version - a.version);
        }
        return matches[0] ? { ...matches[0] } : null;
      }),
      findMany: vi.fn(async ({ where, orderBy }: { where?: any; orderBy?: any }) => {
        let matches = verificationDocs.filter((d) => {
          if (where?.userId && d.userId !== where.userId) return false;
          if (where?.companyId && d.companyId !== where.companyId) return false;
          if (where?.category && d.category !== where.category) return false;
          if (where?.status && d.status !== where.status) return false;
          return true;
        });
        return matches.map((m) => ({ ...m }));
      }),
      create: vi.fn(async ({ data }: { data: any }) => {
        const newDoc: MockVerificationDocument = {
          id: randomUUID(),
          category: data.category,
          type: data.type,
          s3Key: data.s3Key,
          s3Bucket: data.s3Bucket,
          fileName: data.fileName,
          fileSize: data.fileSize,
          mimeType: data.mimeType,
          status: data.status || 'SUBMITTED',
          version: data.version || 1,
          reviewRemarks: data.reviewRemarks || null,
          reviewedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: data.userId || null,
          companyId: data.companyId || null,
          uploadedById: data.uploadedById,
          reviewedById: null,
        };
        verificationDocs.push(newDoc);
        return { ...newDoc };
      }),
      update: vi.fn(async ({ where, data }: { where: { id: string }; data: any }) => {
        const idx = verificationDocs.findIndex((d) => d.id === where.id);
        if (idx === -1) throw new Error('Document not found');
        verificationDocs[idx] = { ...verificationDocs[idx], ...data, updatedAt: new Date() };
        return { ...verificationDocs[idx] };
      }),
    },
    verificationAuditLog: {
      findMany: vi.fn(async ({ where, orderBy }: { where?: any; orderBy?: any }) => {
        return auditLogs
          .filter((l) => (!where?.entityId || l.entityId === where.entityId) && (!where?.entityType || l.entityType === where.entityType))
          .map((l) => ({ ...l }));
      }),
      create: vi.fn(async ({ data }: { data: any }) => {
        const newLog: MockVerificationAuditLog = {
          id: randomUUID(),
          entityType: data.entityType,
          entityId: data.entityId,
          previousStatus: data.previousStatus,
          newStatus: data.newStatus,
          remarks: data.remarks || null,
          performedById: data.performedById,
          createdAt: new Date(),
        };
        auditLogs.push(newLog);
        return { ...newLog };
      }),
    },
    $transaction: vi.fn(async (cb: (tx: any) => Promise<any>) => {
      return cb(mock);
    }),
    $disconnect: vi.fn(async () => {}),
  };

  return mock;
}

export const mockPrisma = createMockPrisma();
