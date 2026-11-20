import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireRoles } from '../../middlewares/role.middleware';
import { validateRequest } from '../../middlewares/validate.middleware';
import {
  submitCompanyVerificationParamSchema,
  verificationDecisionSchema,
  resubmitVerificationSchema,
} from './verification.schema';
import {
  submitUserKYCHandler,
  submitCompanyVerificationHandler,
  getUserStatusHandler,
  getCompanyStatusHandler,
  listPendingReviewsHandler,
  startReviewHandler,
  reviewUserDecisionHandler,
  reviewCompanyDecisionHandler,
  resubmitUserKYCHandler,
  resubmitCompanyVerificationHandler,
} from './verification.controller';

const router = Router();

router.use(authenticate);

// ── User KYC Endpoints ────────────────────────────────────
router.post('/user/submit', submitUserKYCHandler);
router.get('/user/status', getUserStatusHandler);
router.post('/user/resubmit', validateRequest(resubmitVerificationSchema), resubmitUserKYCHandler);

// ── Company Verification Endpoints ────────────────────────
router.post(
  '/company/:companyId/submit',
  validateRequest(submitCompanyVerificationParamSchema),
  submitCompanyVerificationHandler
);
router.get(
  '/company/:companyId/status',
  validateRequest(submitCompanyVerificationParamSchema),
  getCompanyStatusHandler
);
router.post(
  '/company/:companyId/resubmit',
  validateRequest(submitCompanyVerificationParamSchema),
  validateRequest(resubmitVerificationSchema),
  resubmitCompanyVerificationHandler
);

// ── Platform Admin Review Endpoints (PLATFORM_ADMIN ONLY) ───
// Strict business rule: Only PLATFORM_ADMIN can approve, reject or request corrections
router.get(
  '/admin/queue',
  requireRoles('PLATFORM_ADMIN'),
  listPendingReviewsHandler
);

router.post(
  '/admin/start-review',
  requireRoles('PLATFORM_ADMIN'),
  startReviewHandler
);

router.post(
  '/admin/user/:id/decision',
  requireRoles('PLATFORM_ADMIN'),
  validateRequest(verificationDecisionSchema),
  reviewUserDecisionHandler
);

router.post(
  '/admin/company/:id/decision',
  requireRoles('PLATFORM_ADMIN'),
  validateRequest(verificationDecisionSchema),
  reviewCompanyDecisionHandler
);

export const verificationRouter = router;
