import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import { mockPrisma } from './helpers/mockPrisma';

// Mock the prisma export
vi.mock('../src/config/prisma', () => ({
  prisma: mockPrisma,
}));

// Import app after mocking prisma
import { createApp } from '../src/app';

describe('CargoSync Phase 4: Backend Foundation & Security Suite', () => {
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    // Clear in-memory collections
    mockPrisma.users.length = 0;
    mockPrisma.companies.length = 0;
    mockPrisma.memberships.length = 0;
    mockPrisma.invitations.length = 0;
    mockPrisma.verificationDocs.length = 0;
    mockPrisma.auditLogs.length = 0;
    app = createApp();
  });

  describe('1. Health & Documentation Endpoints', () => {
    it('GET /health returns UP status', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('UP');
      expect(res.body.version).toBe('1.0.0');
    });

    it('GET /api-docs returns Swagger documentation HTML', async () => {
      const res = await request(app).get('/api-docs/');
      expect(res.status).toBe(200);
      expect(res.text).toContain('Swagger UI');
    });
  });

  describe('2. Authentication & Registration APIs', () => {
    const validUser = {
      name: 'Rohan Verma',
      email: 'rohan.verma@example.com',
      phone: '+919876543210',
      password: 'StrongPassword123!',
      role: 'SHIPPER',
      accountType: 'INDIVIDUAL',
      cityHub: 'Mumbai',
    };

    it('POST /api/v1/auth/register creates user and returns JWT token', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(validUser);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user).toBeDefined();
      expect(res.body.data.user.email).toBe(validUser.email.toLowerCase());
      expect(res.body.data.user.verificationStatus).toBe('NOT_SUBMITTED');
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.passwordHash).toBeUndefined(); // Never expose passwords
    });

    it('POST /api/v1/auth/register fails on duplicate email', async () => {
      await request(app).post('/api/v1/auth/register').send(validUser);

      const res = await request(app).post('/api/v1/auth/register').send({
        ...validUser,
        phone: '+919999999999',
      });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('already exists');
    });

    it('POST /api/v1/auth/register rejects invalid email and short password', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        name: 'R',
        email: 'invalid-email',
        phone: '123',
        password: '123',
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.details).toBeDefined();
    });

    it('POST /api/v1/auth/login succeeds with valid credentials', async () => {
      await request(app).post('/api/v1/auth/register').send(validUser);

      const res = await request(app).post('/api/v1/auth/login').send({
        email: validUser.email,
        password: validUser.password,
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe(validUser.email.toLowerCase());
    });

    it('POST /api/v1/auth/login fails with invalid password', async () => {
      await request(app).post('/api/v1/auth/register').send(validUser);

      const res = await request(app).post('/api/v1/auth/login').send({
        email: validUser.email,
        password: 'WrongPassword!',
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('3. JWT Authentication & Role Authorization Middleware', () => {
    let shipperToken: string;

    beforeEach(async () => {
      const reg = await request(app).post('/api/v1/auth/register').send({
        name: 'Shipper One',
        email: 'shipper1@example.com',
        phone: '+919811111111',
        password: 'Password123!',
        role: 'SHIPPER',
        accountType: 'INDIVIDUAL',
      });
      shipperToken = reg.body.data.token;
    });

    it('GET /api/v1/users/me fails without Authorization header', async () => {
      const res = await request(app).get('/api/v1/users/me');
      expect(res.status).toBe(401);
      expect(res.body.error).toContain('Authentication required');
    });

    it('GET /api/v1/users/me succeeds with valid Bearer token', async () => {
      const res = await request(app)
        .get('/api/v1/users/me')
        .set('Authorization', `Bearer ${shipperToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('shipper1@example.com');
    });

    it('Role check: SHIPPER cannot access admin-only verification endpoint (returns 403)', async () => {
      const res = await request(app)
        .patch('/api/v1/users/00000000-0000-0000-0000-000000000000/verification')
        .set('Authorization', `Bearer ${shipperToken}`)
        .send({ status: 'VERIFIED' });

      expect(res.status).toBe(403);
      expect(res.body.error).toContain('Forbidden');
    });
  });

  describe('4. Company Lifecycle & Verification Separation', () => {
    let companyAdminToken: string;
    let adminUserId: string;

    beforeEach(async () => {
      const reg = await request(app).post('/api/v1/auth/register').send({
        name: 'Company Founder',
        email: 'founder@logisticshub.com',
        phone: '+919822222222',
        password: 'Password123!',
        role: 'COMPANY_ADMIN',
        accountType: 'COMPANY',
      });
      companyAdminToken = reg.body.data.token;
      adminUserId = reg.body.data.user.id;
    });

    it('POST /api/v1/companies creates company, makes creator ADMIN, and records separate status', async () => {
      const res = await request(app)
        .post('/api/v1/companies')
        .set('Authorization', `Bearer ${companyAdminToken}`)
        .send({
          legalName: 'TransIndia Freight Express',
          businessType: 'Private Limited',
          gstin: '07AAAAA0000A1Z5',
          registeredAddress: 'Transport Nagar, Delhi',
          fleetSize: 15,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.legalName).toBe('TransIndia Freight Express');
      expect(res.body.data.adminId).toBe(adminUserId);
      expect(res.body.data.verificationStatus).toBe('NOT_SUBMITTED');

      // Verify creator membership was automatically added as ADMIN
      const teamRes = await request(app)
        .get(`/api/v1/companies/${res.body.data.id}/team`)
        .set('Authorization', `Bearer ${companyAdminToken}`);

      expect(teamRes.status).toBe(200);
      expect(teamRes.body.data.length).toBe(1);
      expect(teamRes.body.data[0].companyRole).toBe('ADMIN');
      expect(teamRes.body.data[0].membershipStatus).toBe('ACTIVE');
    });

    it('Rejects duplicate GSTIN', async () => {
      const companyPayload = {
        legalName: 'Company A',
        businessType: 'Partnership',
        gstin: '27AABCU9603R1ZX',
        registeredAddress: 'Mumbai Port Area',
      };

      await request(app)
        .post('/api/v1/companies')
        .set('Authorization', `Bearer ${companyAdminToken}`)
        .send(companyPayload);

      const dupRes = await request(app)
        .post('/api/v1/companies')
        .set('Authorization', `Bearer ${companyAdminToken}`)
        .send(companyPayload);

      expect(dupRes.status).toBe(409);
      expect(dupRes.body.error).toContain('GSTIN is already registered');
    });

    it('Company Admin cannot approve their own company (returns 403 Forbidden)', async () => {
      const compRes = await request(app)
        .post('/api/v1/companies')
        .set('Authorization', `Bearer ${companyAdminToken}`)
        .send({
          legalName: 'SelfApproval Transport',
          businessType: 'LLP',
          gstin: '06AAACR1234A1Z2',
          registeredAddress: 'Gurugram Cyber Hub',
        });

      const companyId = compRes.body.data.id;

      // Company Admin tries to self-verify company -> must fail with 403
      const selfVerifyRes = await request(app)
        .patch(`/api/v1/companies/${companyId}/verification`)
        .set('Authorization', `Bearer ${companyAdminToken}`)
        .send({ status: 'VERIFIED' });

      expect(selfVerifyRes.status).toBe(403);
      expect(selfVerifyRes.body.error).toContain('Forbidden');
    });

    it('Company Admin cannot approve employee KYC (returns 403 Forbidden)', async () => {
      // Company Admin tries to approve user KYC -> must fail with 403
      const kycRes = await request(app)
        .patch(`/api/v1/users/${adminUserId}/verification`)
        .set('Authorization', `Bearer ${companyAdminToken}`)
        .send({ status: 'VERIFIED' });

      expect(kycRes.status).toBe(403);
      expect(kycRes.body.error).toContain('Forbidden');
    });

    it('Platform Admin verifies company; statuses remain segregated from employee KYC', async () => {
      // Create Platform Admin
      const platReg = await request(app).post('/api/v1/auth/register').send({
        name: 'Platform Auditor',
        email: 'auditor@cargosync.internal',
        phone: '+919800000000',
        password: 'Password123!',
        role: 'PLATFORM_ADMIN',
        accountType: 'INDIVIDUAL',
      });
      const platformAdminToken = platReg.body.data.token;

      const compRes = await request(app)
        .post('/api/v1/companies')
        .set('Authorization', `Bearer ${companyAdminToken}`)
        .send({
          legalName: 'QuickFleet Corp',
          businessType: 'LLP',
          gstin: '06AAACR1234A1Z1',
          registeredAddress: 'Gurugram Cyber Hub',
        });

      const companyId = compRes.body.data.id;

      // Platform Admin verifies the company
      const updateComp = await request(app)
        .patch(`/api/v1/companies/${companyId}/verification`)
        .set('Authorization', `Bearer ${platformAdminToken}`)
        .send({ status: 'VERIFIED' });

      expect(updateComp.status).toBe(200);
      expect(updateComp.body.data.verificationStatus).toBe('VERIFIED');

      // Verify that individual employee/admin verification status remains NOT_SUBMITTED
      const teamRes = await request(app)
        .get(`/api/v1/companies/${companyId}/team`)
        .set('Authorization', `Bearer ${companyAdminToken}`);

      expect(teamRes.body.data[0].individualVerificationStatus).toBe('NOT_SUBMITTED');
    });
  });

  describe('5. Invitation Creation, Single-Use & Expiry Enforcement', () => {
    let adminToken: string;
    let employeeToken: string;
    let companyId: string;

    beforeEach(async () => {
      // 1. Create company admin
      const adminReg = await request(app).post('/api/v1/auth/register').send({
        name: 'Fleet Owner',
        email: 'owner@logistics.com',
        phone: '+919833333333',
        password: 'Password123!',
        role: 'COMPANY_ADMIN',
        accountType: 'COMPANY',
      });
      adminToken = adminReg.body.data.token;

      // 2. Register company
      const compRes = await request(app)
        .post('/api/v1/companies')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          legalName: 'Apex Transport',
          businessType: 'Private Limited',
          gstin: '29ABCDE1234F1Z5',
          registeredAddress: 'Bengaluru Logistics Park',
        });
      companyId = compRes.body.data.id;

      // 3. Register a regular user to act as invitee
      const empReg = await request(app).post('/api/v1/auth/register').send({
        name: 'Sunil Driver',
        email: 'sunil@truckers.in',
        phone: '+919844444444',
        password: 'Password123!',
        role: 'DRIVER',
        accountType: 'INDIVIDUAL',
      });
      employeeToken = empReg.body.data.token;
    });

    it('Generates role-specific, expiring invitation code', async () => {
      const res = await request(app)
        .post('/api/v1/invitations')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          companyId,
          role: 'DRIVER',
          expiresInHours: 24,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.code).toBeDefined();
      expect(res.body.data.code.length).toBe(6);
      expect(res.body.data.role).toBe('DRIVER');
      expect(res.body.data.used).toBe(false);
    });

    it('Accepting invitation joins company, assigns role, and marks code as used', async () => {
      const inviteRes = await request(app)
        .post('/api/v1/invitations')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          companyId,
          role: 'DRIVER',
          expiresInHours: 48,
        });

      const inviteCode = inviteRes.body.data.code;

      // Preview / verify invite
      const verifyRes = await request(app)
        .get(`/api/v1/invitations/verify/${inviteCode}`)
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(verifyRes.status).toBe(200);
      expect(verifyRes.body.data.company.legalName).toBe('Apex Transport');
      expect(verifyRes.body.data.role).toBe('DRIVER');

      // Accept invite
      const acceptRes = await request(app)
        .post('/api/v1/invitations/accept')
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({ code: inviteCode });

      expect(acceptRes.status).toBe(200);
      expect(acceptRes.body.success).toBe(true);
      expect(acceptRes.body.data.company.companyRole).toBe('DRIVER');

      // Verify employee is now in company team
      const teamRes = await request(app)
        .get(`/api/v1/companies/${companyId}/team`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(teamRes.body.data.length).toBe(2);
      const joinedMember = teamRes.body.data.find((m: any) => m.name === 'Sunil Driver');
      expect(joinedMember).toBeDefined();
      expect(joinedMember.companyRole).toBe('DRIVER');
    });

    it('Single-use guarantee: Re-using the same invitation code fails with 410', async () => {
      const inviteRes = await request(app)
        .post('/api/v1/invitations')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          companyId,
          role: 'DRIVER',
          expiresInHours: 48,
        });

      const inviteCode = inviteRes.body.data.code;

      // First acceptance
      await request(app)
        .post('/api/v1/invitations/accept')
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({ code: inviteCode });

      // Create a second user trying to use the same single-use code
      const secondUserReg = await request(app).post('/api/v1/auth/register').send({
        name: 'Another User',
        email: 'user2@truckers.in',
        phone: '+919855555555',
        password: 'Password123!',
        role: 'DRIVER',
        accountType: 'INDIVIDUAL',
      });

      const secondAcceptRes = await request(app)
        .post('/api/v1/invitations/accept')
        .set('Authorization', `Bearer ${secondUserReg.body.data.token}`)
        .send({ code: inviteCode });

      expect(secondAcceptRes.status).toBe(410);
      expect(secondAcceptRes.body.error).toContain('already been used');
    });

    it('Rejects expired invitation code with 410', async () => {
      // Create manually expired invite in mock store
      const expiredInvite = {
        id: 'inv_expired_test',
        code: 'EXPIRE',
        companyId,
        role: 'MEMBER' as const,
        createdById: 'admin_test',
        expiresAt: new Date(Date.now() - 3600000), // 1 hour ago
        used: false,
        createdAt: new Date(),
      };
      mockPrisma.invitations.push(expiredInvite);

      const res = await request(app)
        .post('/api/v1/invitations/accept')
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({ code: 'EXPIRE' });

      expect(res.status).toBe(410);
      expect(res.body.error).toContain('expired');
    });
  });

  describe('6. Phase 5: Document Management & Multi-Stage Verification Workflow', () => {
    let platformAdminToken: string;
    let shipperToken: string;
    let driverToken: string;
    let driverId: string;
    let companyAdminToken: string;
    let companyId: string;

    beforeEach(async () => {
      // 1. Create Platform Admin
      const platReg = await request(app).post('/api/v1/auth/register').send({
        name: 'Super Auditor',
        email: 'auditor@cargosync.internal',
        phone: '+919100000001',
        password: 'Password123!',
        role: 'PLATFORM_ADMIN',
        accountType: 'INDIVIDUAL',
      });
      platformAdminToken = platReg.body.data.token;

      // 2. Create Shipper
      const shipReg = await request(app).post('/api/v1/auth/register').send({
        name: 'Delhi Traders',
        email: 'delhi.traders@example.com',
        phone: '+919100000002',
        password: 'Password123!',
        role: 'SHIPPER',
        accountType: 'INDIVIDUAL',
      });
      shipperToken = shipReg.body.data.token;

      // 3. Create Driver
      const dvrReg = await request(app).post('/api/v1/auth/register').send({
        name: 'Ramesh Pilot',
        email: 'ramesh.pilot@example.com',
        phone: '+919100000003',
        password: 'Password123!',
        role: 'DRIVER',
        accountType: 'INDIVIDUAL',
      });
      driverToken = dvrReg.body.data.token;
      driverId = dvrReg.body.data.user.id;

      // 4. Create Company Admin & Company
      const caReg = await request(app).post('/api/v1/auth/register').send({
        name: 'Fleet Boss',
        email: 'boss@expresscargo.in',
        phone: '+919100000004',
        password: 'Password123!',
        role: 'COMPANY_ADMIN',
        accountType: 'COMPANY',
      });
      companyAdminToken = caReg.body.data.token;

      const compRes = await request(app)
        .post('/api/v1/companies')
        .set('Authorization', `Bearer ${companyAdminToken}`)
        .send({
          legalName: 'Express Cargo Ltd',
          businessType: 'Private Limited',
          gstin: '07AAACE1234F1Z1',
          registeredAddress: 'Okhla Industrial Area, New Delhi',
        });
      companyId = compRes.body.data.id;
    });

    it('Driver can request presigned upload URL for DRIVING_LICENCE', async () => {
      const res = await request(app)
        .post('/api/v1/documents/presign-upload')
        .set('Authorization', `Bearer ${driverToken}`)
        .send({
          category: 'INDIVIDUAL',
          type: 'DRIVING_LICENCE',
          fileName: 'my_license.pdf',
          fileSize: 1024 * 500,
          mimeType: 'application/pdf',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.uploadUrl).toBeDefined();
      expect(res.body.data.s3Key).toContain('documents/users/');
      expect(res.body.data.s3Key).toContain('driving_licence');
    });

    it('Shipper is prohibited from uploading DRIVING_LICENCE (returns 400)', async () => {
      const res = await request(app)
        .post('/api/v1/documents/presign-upload')
        .set('Authorization', `Bearer ${shipperToken}`)
        .send({
          category: 'INDIVIDUAL',
          type: 'DRIVING_LICENCE',
          fileName: 'license.pdf',
          fileSize: 1024 * 500,
          mimeType: 'application/pdf',
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('not permitted to upload document type DRIVING_LICENCE');
    });

    it('Rejects file with disallowed MIME type or exceeding size limit', async () => {
      // Disallowed executable
      const mimeRes = await request(app)
        .post('/api/v1/documents/presign-upload')
        .set('Authorization', `Bearer ${driverToken}`)
        .send({
          category: 'INDIVIDUAL',
          type: 'DRIVING_LICENCE',
          fileName: 'malware.exe',
          fileSize: 1024 * 500,
          mimeType: 'application/x-msdownload',
        });
      expect(mimeRes.status).toBe(400);

      // Exceeds 10MB
      const sizeRes = await request(app)
        .post('/api/v1/documents/presign-upload')
        .set('Authorization', `Bearer ${driverToken}`)
        .send({
          category: 'INDIVIDUAL',
          type: 'DRIVING_LICENCE',
          fileName: 'huge_file.pdf',
          fileSize: 15 * 1024 * 1024, // 15MB
          mimeType: 'application/pdf',
        });
      expect(sizeRes.status).toBe(400);
    });

    it('Company Admin can request presigned upload for company document', async () => {
      const res = await request(app)
        .post('/api/v1/documents/presign-upload')
        .set('Authorization', `Bearer ${companyAdminToken}`)
        .send({
          category: 'COMPANY',
          companyId,
          type: 'GST_CERTIFICATE',
          fileName: 'gst_certificate.pdf',
          fileSize: 1024 * 600,
          mimeType: 'application/pdf',
        });

      expect(res.status).toBe(200);
      expect(res.body.data.s3Key).toContain(`documents/companies/${companyId}`);
    });

    it('Unauthorized user blocked from company presigned upload (returns 403)', async () => {
      const res = await request(app)
        .post('/api/v1/documents/presign-upload')
        .set('Authorization', `Bearer ${driverToken}`)
        .send({
          category: 'COMPANY',
          companyId,
          type: 'GST_CERTIFICATE',
          fileName: 'gst_certificate.pdf',
          fileSize: 1024 * 600,
          mimeType: 'application/pdf',
        });

      expect(res.status).toBe(403);
      expect(res.body.error).toContain('not authorized');
    });

    it('Registers document metadata and increments version on replacement', async () => {
      const docPayload = {
        category: 'INDIVIDUAL',
        type: 'DRIVING_LICENCE',
        s3Key: `documents/users/${driverId}/dl_v1.pdf`,
        fileName: 'license.pdf',
        fileSize: 50000,
        mimeType: 'application/pdf',
      };

      const doc1 = await request(app)
        .post('/api/v1/documents')
        .set('Authorization', `Bearer ${driverToken}`)
        .send(docPayload);

      expect(doc1.status).toBe(201);
      expect(doc1.body.data.version).toBe(1);

      // Re-register replaced document
      const doc2 = await request(app)
        .post('/api/v1/documents')
        .set('Authorization', `Bearer ${driverToken}`)
        .send({
          ...docPayload,
          s3Key: `documents/users/${driverId}/dl_v2.pdf`,
        });

      expect(doc2.status).toBe(201);
      expect(doc2.body.data.version).toBe(2);
    });

    it('Presigned download URL: accessible to owner and platform admin, blocked to others', async () => {
      const reg = await request(app)
        .post('/api/v1/documents')
        .set('Authorization', `Bearer ${driverToken}`)
        .send({
          category: 'INDIVIDUAL',
          type: 'DRIVING_LICENCE',
          s3Key: `documents/users/${driverId}/dl.pdf`,
          fileName: 'dl.pdf',
          fileSize: 50000,
          mimeType: 'application/pdf',
        });
      const docId = reg.body.data.id;

      // Owner downloads -> 200
      const ownerRes = await request(app)
        .get(`/api/v1/documents/${docId}/download`)
        .set('Authorization', `Bearer ${driverToken}`);
      expect(ownerRes.status).toBe(200);
      expect(ownerRes.body.data.downloadUrl).toBeDefined();

      // Platform admin downloads -> 200
      const adminRes = await request(app)
        .get(`/api/v1/documents/${docId}/download`)
        .set('Authorization', `Bearer ${platformAdminToken}`);
      expect(adminRes.status).toBe(200);

      // Unauthorized other user downloads -> 403
      const unauthRes = await request(app)
        .get(`/api/v1/documents/${docId}/download`)
        .set('Authorization', `Bearer ${shipperToken}`);
      expect(unauthRes.status).toBe(403);
    });

    it('Driver verification submission requires driving licence (fails if missing)', async () => {
      // Driver has not uploaded driving licence yet
      const res = await request(app)
        .post('/api/v1/verification/user/submit')
        .set('Authorization', `Bearer ${driverToken}`);

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Missing mandatory document: DRIVING_LICENCE');
    });

    it('Driver submission succeeds when driving licence and secondary proof are present', async () => {
      // Register DL
      await request(app)
        .post('/api/v1/documents')
        .set('Authorization', `Bearer ${driverToken}`)
        .send({
          category: 'INDIVIDUAL',
          type: 'DRIVING_LICENCE',
          s3Key: `documents/users/${driverId}/dl.pdf`,
          fileName: 'dl.pdf',
          fileSize: 50000,
          mimeType: 'application/pdf',
        });

      // Register Aadhaar
      await request(app)
        .post('/api/v1/documents')
        .set('Authorization', `Bearer ${driverToken}`)
        .send({
          category: 'INDIVIDUAL',
          type: 'AADHAAR',
          s3Key: `documents/users/${driverId}/aadhaar.pdf`,
          fileName: 'aadhaar.pdf',
          fileSize: 50000,
          mimeType: 'application/pdf',
        });

      const submitRes = await request(app)
        .post('/api/v1/verification/user/submit')
        .set('Authorization', `Bearer ${driverToken}`);

      expect(submitRes.status).toBe(200);
      expect(submitRes.body.status).toBe('PENDING');

      // Check user status
      const statusRes = await request(app)
        .get('/api/v1/verification/user/status')
        .set('Authorization', `Bearer ${driverToken}`);

      expect(statusRes.body.data.verificationStatus).toBe('PENDING');
      expect(statusRes.body.data.auditHistory.length).toBeGreaterThan(0);
    });

    it('Full Platform Admin review workflow: Queue -> Start Review -> Correction -> Resubmit -> Approval', async () => {
      // 1. Prepare and submit driver KYC
      await request(app)
        .post('/api/v1/documents')
        .set('Authorization', `Bearer ${driverToken}`)
        .send({
          category: 'INDIVIDUAL',
          type: 'DRIVING_LICENCE',
          s3Key: `documents/users/${driverId}/dl.pdf`,
          fileName: 'dl.pdf',
          fileSize: 50000,
          mimeType: 'application/pdf',
        });

      await request(app)
        .post('/api/v1/documents')
        .set('Authorization', `Bearer ${driverToken}`)
        .send({
          category: 'INDIVIDUAL',
          type: 'PAN',
          s3Key: `documents/users/${driverId}/pan.pdf`,
          fileName: 'pan.pdf',
          fileSize: 50000,
          mimeType: 'application/pdf',
        });

      await request(app)
        .post('/api/v1/verification/user/submit')
        .set('Authorization', `Bearer ${driverToken}`);

      // 2. Platform Admin views review queue
      const queueRes = await request(app)
        .get('/api/v1/verification/admin/queue')
        .set('Authorization', `Bearer ${platformAdminToken}`);

      expect(queueRes.status).toBe(200);
      expect(queueRes.body.data.users.some((u: any) => u.id === driverId)).toBe(true);

      // Non-admin blocked from review queue
      const unauthQueue = await request(app)
        .get('/api/v1/verification/admin/queue')
        .set('Authorization', `Bearer ${shipperToken}`);
      expect(unauthQueue.status).toBe(403);

      // 3. Platform Admin starts review
      const startRes = await request(app)
        .post('/api/v1/verification/admin/start-review')
        .set('Authorization', `Bearer ${platformAdminToken}`)
        .send({ entityType: 'INDIVIDUAL', entityId: driverId });

      expect(startRes.status).toBe(200);
      expect(startRes.body.status).toBe('UNDER_REVIEW');

      // 4. Platform Admin requests correction (fails if remarks are omitted)
      const invalidDecision = await request(app)
        .post(`/api/v1/verification/admin/user/${driverId}/decision`)
        .set('Authorization', `Bearer ${platformAdminToken}`)
        .send({ status: 'CORRECTION_REQUIRED' });
      expect(invalidDecision.status).toBe(400);

      // Valid correction request
      const corrDecision = await request(app)
        .post(`/api/v1/verification/admin/user/${driverId}/decision`)
        .set('Authorization', `Bearer ${platformAdminToken}`)
        .send({
          status: 'CORRECTION_REQUIRED',
          remarks: 'Driving licence photo is blurred. Please upload a clear color copy.',
        });

      expect(corrDecision.status).toBe(200);
      expect(corrDecision.body.status).toBe('CORRECTION_REQUIRED');

      // 5. Driver resubmits corrected documents
      const resubmitRes = await request(app)
        .post('/api/v1/verification/user/resubmit')
        .set('Authorization', `Bearer ${driverToken}`)
        .send({ notes: 'Uploaded high resolution scan of driving licence' });

      expect(resubmitRes.status).toBe(200);
      expect(resubmitRes.body.status).toBe('PENDING');

      // 6. Platform Admin grants final verification
      const finalApproval = await request(app)
        .post(`/api/v1/verification/admin/user/${driverId}/decision`)
        .set('Authorization', `Bearer ${platformAdminToken}`)
        .send({
          status: 'VERIFIED',
          remarks: 'All documents verified and approved.',
        });

      expect(finalApproval.status).toBe(200);
      expect(finalApproval.body.status).toBe('VERIFIED');
    });

    it('Company verification workflow and strict employee KYC segregation', async () => {
      // 1. Upload company statutory documents
      await request(app)
        .post('/api/v1/documents')
        .set('Authorization', `Bearer ${companyAdminToken}`)
        .send({
          category: 'COMPANY',
          companyId,
          type: 'GST_CERTIFICATE',
          s3Key: `documents/companies/${companyId}/gst.pdf`,
          fileName: 'gst.pdf',
          fileSize: 80000,
          mimeType: 'application/pdf',
        });

      await request(app)
        .post('/api/v1/documents')
        .set('Authorization', `Bearer ${companyAdminToken}`)
        .send({
          category: 'COMPANY',
          companyId,
          type: 'PAN',
          s3Key: `documents/companies/${companyId}/pan.pdf`,
          fileName: 'pan.pdf',
          fileSize: 80000,
          mimeType: 'application/pdf',
        });

      // 2. Submit company verification
      const submitComp = await request(app)
        .post(`/api/v1/verification/company/${companyId}/submit`)
        .set('Authorization', `Bearer ${companyAdminToken}`);

      expect(submitComp.status).toBe(200);
      expect(submitComp.body.status).toBe('PENDING');

      // 3. Platform Admin approves company
      const approveRes = await request(app)
        .post(`/api/v1/verification/admin/company/${companyId}/decision`)
        .set('Authorization', `Bearer ${platformAdminToken}`)
        .send({
          status: 'VERIFIED',
          remarks: 'Company GSTIN and legal documents verified successfully',
        });

      expect(approveRes.status).toBe(200);
      expect(approveRes.body.status).toBe('VERIFIED');

      // 4. CRITICAL RULE: Company approval must NOT automatically verify employees
      const teamRes = await request(app)
        .get(`/api/v1/companies/${companyId}/team`)
        .set('Authorization', `Bearer ${companyAdminToken}`);

      expect(teamRes.body.data[0].individualVerificationStatus).toBe('NOT_SUBMITTED');
    });
  });
});
