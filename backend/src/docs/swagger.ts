export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'CargoSync Backend API',
    version: '1.1.0',
    description: 'CargoSync Backend: Authentication, Companies, Invitations, Document Management & Multi-Stage Verification',
  },
  servers: [
    {
      url: '/api/v1',
      description: 'API v1 Base',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      RegisterRequest: {
        type: 'object',
        required: ['name', 'email', 'phone', 'password'],
        properties: {
          name: { type: 'string', example: 'Aarav Sharma' },
          email: { type: 'string', format: 'email', example: 'aarav@cargosync.in' },
          phone: { type: 'string', example: '+919876543210' },
          password: { type: 'string', minLength: 6, example: 'SecureP@ss123' },
          role: {
            type: 'string',
            enum: ['SHIPPER', 'DRIVER', 'FLEET_MANAGER', 'COMPANY_ADMIN', 'PLATFORM_ADMIN'],
            example: 'SHIPPER',
          },
          accountType: {
            type: 'string',
            enum: ['INDIVIDUAL', 'COMPANY'],
            example: 'INDIVIDUAL',
          },
          cityHub: { type: 'string', example: 'Delhi NCR' },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'aarav@cargosync.in' },
          password: { type: 'string', example: 'SecureP@ss123' },
        },
      },
      PresignUploadRequest: {
        type: 'object',
        required: ['category', 'type', 'fileName', 'fileSize', 'mimeType'],
        properties: {
          category: { type: 'string', enum: ['INDIVIDUAL', 'COMPANY'] },
          type: {
            type: 'string',
            enum: ['AADHAAR', 'DRIVING_LICENCE', 'PAN', 'RC', 'GST_CERTIFICATE', 'INCORPORATION', 'BANK_STATEMENT'],
          },
          fileName: { type: 'string', example: 'driving_licence.pdf' },
          fileSize: { type: 'integer', example: 1048576 },
          mimeType: { type: 'string', example: 'application/pdf' },
          companyId: { type: 'string', format: 'uuid' },
        },
      },
      RegisterDocumentRequest: {
        type: 'object',
        required: ['category', 'type', 's3Key', 'fileName', 'fileSize', 'mimeType'],
        properties: {
          category: { type: 'string', enum: ['INDIVIDUAL', 'COMPANY'] },
          type: {
            type: 'string',
            enum: ['AADHAAR', 'DRIVING_LICENCE', 'PAN', 'RC', 'GST_CERTIFICATE', 'INCORPORATION', 'BANK_STATEMENT'],
          },
          s3Key: { type: 'string', example: 'documents/users/123/driving_licence.pdf' },
          fileName: { type: 'string', example: 'driving_licence.pdf' },
          fileSize: { type: 'integer', example: 1048576 },
          mimeType: { type: 'string', example: 'application/pdf' },
          companyId: { type: 'string', format: 'uuid' },
        },
      },
      VerificationDecisionRequest: {
        type: 'object',
        required: ['status'],
        properties: {
          status: { type: 'string', enum: ['VERIFIED', 'CORRECTION_REQUIRED', 'REJECTED'] },
          remarks: { type: 'string', example: 'Documents verified and approved.' },
          documentDecisions: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                documentId: { type: 'string', format: 'uuid' },
                status: { type: 'string', enum: ['APPROVED', 'REJECTED', 'CORRECTION_REQUIRED'] },
                remarks: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
  paths: {
    '/auth/register': {
      post: {
        summary: 'Register new user',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterRequest' } } },
        },
        responses: { 201: { description: 'Registration successful' } },
      },
    },
    '/auth/login': {
      post: {
        summary: 'User login',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } },
        },
        responses: { 200: { description: 'Login successful' } },
      },
    },
    '/documents/presign-upload': {
      post: {
        summary: 'Generate presigned S3 upload URL with role & size validation',
        tags: ['Documents'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/PresignUploadRequest' } } },
        },
        responses: { 200: { description: 'Presigned upload URL generated' } },
      },
    },
    '/documents': {
      post: {
        summary: 'Register uploaded document metadata',
        tags: ['Documents'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterDocumentRequest' } } },
        },
        responses: { 201: { description: 'Document registered' } },
      },
      get: {
        summary: 'List documents for caller or company',
        tags: ['Documents'],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'List of documents' } },
      },
    },
    '/documents/{id}/download': {
      get: {
        summary: 'Get presigned download URL for document',
        tags: ['Documents'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Presigned download URL' } },
      },
    },
    '/verification/user/submit': {
      post: {
        summary: 'Submit uploaded KYC documents for manual review',
        tags: ['Verification'],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Submitted for manual review' } },
      },
    },
    '/verification/user/status': {
      get: {
        summary: 'Get user KYC status, requirements checklist, and review history',
        tags: ['Verification'],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Current KYC status' } },
      },
    },
    '/verification/user/resubmit': {
      post: {
        summary: 'Resubmit user KYC after correcting requested documents',
        tags: ['Verification'],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Resubmitted for review' } },
      },
    },
    '/verification/company/{companyId}/submit': {
      post: {
        summary: 'Submit company statutory documents for manual review',
        tags: ['Verification'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'companyId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Company documents submitted' } },
      },
    },
    '/verification/company/{companyId}/status': {
      get: {
        summary: 'Get company verification status, documents, and audit history',
        tags: ['Verification'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'companyId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Company verification status' } },
      },
    },
    '/verification/company/{companyId}/resubmit': {
      post: {
        summary: 'Resubmit company documents after correcting requested items',
        tags: ['Verification'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'companyId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Resubmitted' } },
      },
    },
    '/verification/admin/queue': {
      get: {
        summary: 'List pending user and company verification reviews (Platform Admin only)',
        tags: ['Verification - Admin'],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Queue of pending reviews' } },
      },
    },
    '/verification/admin/user/{id}/decision': {
      post: {
        summary: 'Approve, reject, or request corrections for user KYC (Platform Admin only)',
        tags: ['Verification - Admin'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/VerificationDecisionRequest' } } },
        },
        responses: { 200: { description: 'Decision recorded' } },
      },
    },
    '/verification/admin/company/{id}/decision': {
      post: {
        summary: 'Approve, reject, or request corrections for company (Platform Admin only)',
        tags: ['Verification - Admin'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/VerificationDecisionRequest' } } },
        },
        responses: { 200: { description: 'Decision recorded' } },
      },
    },
  },
};
