import { z } from 'zod';

export const createInvitationSchema = z.object({
  body: z.object({
    companyId: z.string().uuid('Invalid company ID format'),
    role: z.enum(['ADMIN', 'DISPATCHER', 'FLEET_MANAGER', 'DRIVER', 'MEMBER']).default('MEMBER'),
    invitedEmail: z.string().email('Invalid email format').optional(),
    expiresInHours: z.number().int().min(1).max(720).default(48), // Default 48 hours
  }),
});

export const acceptInvitationSchema = z.object({
  body: z.object({
    code: z.string().min(4, 'Invitation code is required').trim(),
  }),
});

export const verifyInvitationQuerySchema = z.object({
  params: z.object({
    code: z.string().min(4).trim(),
  }),
});

export type CreateInvitationInput = z.infer<typeof createInvitationSchema>['body'];
export type AcceptInvitationInput = z.infer<typeof acceptInvitationSchema>['body'];
