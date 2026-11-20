import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireRoles } from '../../middlewares/role.middleware';
import { validateRequest } from '../../middlewares/validate.middleware';
import { updateProfileSchema, updateVerificationStatusSchema } from './user.schema';
import { getMeHandler, updateMeHandler, updateVerificationHandler } from './user.controller';

const router = Router();

// Authenticated routes
router.use(authenticate);

router.get('/me', getMeHandler);
router.patch('/me', validateRequest(updateProfileSchema), updateMeHandler);

// Platform Auditor / CargoSync platform administrator route ONLY
// Company Admin cannot approve employee KYC
router.patch(
  '/:id/verification',
  requireRoles('PLATFORM_ADMIN'),
  validateRequest(updateVerificationStatusSchema),
  updateVerificationHandler
);

export const userRouter = router;
