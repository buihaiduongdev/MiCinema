/**
 * Users Routes
 *
 * Dùng: express.Router()
 * Middleware: authMiddleware, validate(schema), roleGuard(['ADMIN'])
 * Mount: app.use('/api/users', userRoutes) trong app.ts
 */

import { Router } from 'express';
import * as userController from './user.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { protect, restrictTo } from '../../middlewares/auth.middleware.js';
import { userSchema, updateProfileSchema } from '@shared/schemas/user.schema.js';
import { ROLES } from '@shared/constants/roles.js';
import z from 'zod';

const router = Router();

// --- PRIVATE ROUTES (require authentication)
router.use(protect);

// --- ADMIN ROUTES
// Create user (admin only)
router.post('/', restrictTo(ROLES.ADMIN), validate(userSchema), userController.create);

// Get all users with pagination (admin only)
router.get('/', restrictTo(ROLES.ADMIN), userController.getAll);

// Get user by id (admin only)
router.get('/:id', restrictTo(ROLES.ADMIN), userController.getById);

// Update user (admin only)
router.patch('/:id', restrictTo(ROLES.ADMIN), validate(userSchema.partial()), userController.update);

// Delete user (admin only)
router.delete('/:id', restrictTo(ROLES.ADMIN), userController.remove);

export default router;
