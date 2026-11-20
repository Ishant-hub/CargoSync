import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validate.middleware';
import {
  createInvitationSchema,
  acceptInvitationSchema,
  verifyInvitationQuerySchema,
} from './invitation.schema';
import {
  createInvitationHandler,
  verifyInvitationHandler,
  acceptInvitationHandler,
} from './invitation.controller';

const router = Router();

router.use(authenticate);

// Generate single-use role-specific invitation
router.post('/', validateRequest(createInvitationSchema), createInvitationHandler);

// Verify code preview
router.get('/verify/:code', validateRequest(verifyInvitationQuerySchema), verifyInvitationHandler);

// Accept invitation code
router.post('/accept', validateRequest(acceptInvitationSchema), acceptInvitationHandler);

export const invitationRouter = router;
