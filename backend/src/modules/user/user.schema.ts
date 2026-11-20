import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    cityHub: z.string().optional(),
    avatarUrl: z.string().url().optional(),
  }),
});

export const updateVerificationStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid user ID format'),
  }),
  body: z.object({
    status: z.enum(['PENDING', 'VERIFIED', 'CORRECTION_REQUIRED', 'REJECTED']),
  }),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>['body'];
export type UpdateVerificationStatusInput = z.infer<typeof updateVerificationStatusSchema>['body'];
