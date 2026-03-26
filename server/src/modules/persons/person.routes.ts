/**
 * Person Routes — CRUD Actor/Director
 *
 * Public:  GET    /api/persons           — Danh sách (lọc theo role, search)
 * Public:  GET    /api/persons/:id       — Chi tiết
 * Staff+:  POST   /api/persons           — Tạo mới
 * Staff+:  PUT    /api/persons/:id       — Cập nhật
 * Staff+:  DELETE /api/persons/:id       — Xóa (soft delete)
 */

import { Router } from 'express';
import * as personController from './person.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { protect, restrictTo } from '../../middlewares/auth.middleware.js';
import {
  createPersonSchema,
  updatePersonSchema,
  personFilterSchema,
} from '@shared/schemas/person.schema.js';

const router = Router();

// --- PUBLIC ROUTES ---
router.get(
  '/',
  validate({ query: personFilterSchema }),
  personController.getAll,
);
router.get('/nationalities', personController.getNationalities);
router.get('/slug/:slug', personController.getBySlug);
router.get('/:id', personController.getById);

// --- PROTECTED ROUTES (Staff + Admin) ---
router.use(protect);
router.use(restrictTo('STAFF', 'ADMIN'));

router.post('/', validate(createPersonSchema), personController.create);
router.put('/:id', validate(updatePersonSchema), personController.update);
router.delete('/:id', personController.remove);

export default router;
