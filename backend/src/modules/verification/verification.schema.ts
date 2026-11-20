import { z } from 'zod';

export const submitCompanyVerificationParamSchema = z.object({
  params: z.object({
    companyId: z.string().uuid('Invalid company ID format'),
  }),
});

export const verificationDecisionSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid entity ID format'),
  }),
  body: z.object({
    status: z.enum(['VERIFIED', 'CORRECTION_REQUIRED', 'REJECTED']),
    remarks: z.string().optional(),
    documentDecisions: z.array(
      z.object({
        documentId: z.string().uuid(),
        status: z.enum(['APPROVED', 'REJECTED', 'CORRECTION_REQUIRED']),
        remarks: z.string().optional(),
      })
    ).optional(),
  }).refine(
    (data) => {
      if (['CORRECTION_REQUIRED', 'REJECTED'].includes(data.status) && (!data.remarks || data.remarks.trim().length === 0)) {
        return false;
      }
      return true;
    },
    {
      message: 'Remarks are mandatory when rejecting or requesting corrections',
      path: ['remarks'],
    }
  ),
});

export const resubmitVerificationSchema = z.object({
  body: z.object({
    notes: z.string().optional(),
  }),
});

export type VerificationDecisionInput = z.infer<typeof verificationDecisionSchema>['body'];
