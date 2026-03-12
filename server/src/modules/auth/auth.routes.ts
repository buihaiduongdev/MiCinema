import { Router } from 'express';
import * as authController from './auth.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { protect } from 'src/middlewares/auth.middleware.js';
import { registerSchema, loginSchema } from '@shared/schemas/auth.schema.js';

const router = Router();

// --- PUBLIC ROUTES
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
// --- PRIVATE ROUTES
router.use(protect);
router.get('/me', (req, res) => {
  res.json({ success: true, user: req.user });
});
export default router;
