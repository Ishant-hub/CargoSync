import { Router } from 'express';
import { validateRequest } from '../../middlewares/validate.middleware';
import { registerSchema, loginSchema } from './auth.schema';
import { registerHandler, loginHandler } from './auth.controller';

const router = Router();

router.post('/register', validateRequest(registerSchema), registerHandler);
router.post('/login', validateRequest(loginSchema), loginHandler);

export const authRouter = router;
