import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireRoles } from '../../middlewares/role.middleware';
import { validateRequest } from '../../middlewares/validate.middleware';
import {
  createCompanySchema,
  updateCompanyVerificationSchema,
  getCompanyParamSchema,
} from './company.schema';
import {
  createCompanyHandler,
  getCompanyHandler,
  getCompanyTeamHandler,
  updateCompanyVerificationHandler,
} from './company.controller';

const router = Router();

router.use(authenticate);

router.post('/', validateRequest(createCompanySchema), createCompanyHandler);
router.get('/:id', validateRequest(getCompanyParamSchema), getCompanyHandler);
router.get('/:id/team', validateRequest(getCompanyParamSchema), getCompanyTeamHandler);

// Platform Auditor / CargoSync platform administrator route ONLY
// Company Admin cannot approve their own company
router.patch(
  '/:id/verification',
  requireRoles('PLATFORM_ADMIN'),
  validateRequest(updateCompanyVerificationSchema),
  updateCompanyVerificationHandler
);

export const companyRouter = router;
