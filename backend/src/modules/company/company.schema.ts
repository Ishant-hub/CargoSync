import { z } from 'zod';

export const createCompanySchema = z.object({
  body: z.object({
    legalName: z.string().min(2, 'Legal name must be at least 2 characters'),
    businessType: z.string().min(2, 'Business type is required'),
    gstin: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid Indian GSTIN format'),
    registeredAddress: z.string().min(5, 'Registered address must be at least 5 characters'),
    fleetSize: z.number().int().nonnegative().optional(),
  }),
});

export const updateCompanyVerificationSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid company ID format'),
  }),
  body: z.object({
    status: z.enum(['PENDING', 'VERIFIED', 'CORRECTION_REQUIRED', 'REJECTED']),
  }),
});

export const getCompanyParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid company ID format'),
  }),
});

export type CreateCompanyInput = z.infer<typeof createCompanySchema>['body'];
export type UpdateCompanyVerificationInput = z.infer<typeof updateCompanyVerificationSchema>['body'];
