/**
 * Cinema Routes — CRUD Chi nhánh rạp
 *
 * Public:  GET    /api/cinemas              — Danh sách (lọc theo city, search)
 * Public:  GET    /api/cinemas/cities       — Danh sách thành phố (cho dropdown)
 * Public:  GET    /api/cinemas/slug/:slug   — Chi tiết theo slug
 * Public:  GET    /api/cinemas/:id          — Chi tiết theo ID
 * Admin:   POST   /api/cinemas              — Tạo mới
 * Admin:   PUT    /api/cinemas/:id          — Cập nhật
 * Admin:   DELETE /api/cinemas/:id          — Xóa (soft delete)
 */

import { Router } from 'express';
import * as cinemaController from './cinema.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { protect, restrictTo } from '../../middlewares/auth.middleware.js';
import {
  createCinemaSchema,
  updateCinemaSchema,
  cinemaFilterSchema,
} from '@shared/schemas/cinema.schema.js';

const router = Router();

// --- PUBLIC ROUTES ---
router.get('/cities', cinemaController.getCities);
router.get('/slug/:slug', cinemaController.getBySlug);
router.get(
  '/',
  validate({ query: cinemaFilterSchema }),
  cinemaController.getAll,
);
router.get('/:id', cinemaController.getById);

// --- PROTECTED ROUTES (Admin only) ---
router.use(protect);
router.use(restrictTo('ADMIN'));

router.post('/', validate(createCinemaSchema), cinemaController.create);
router.put('/:id', validate(updateCinemaSchema), cinemaController.update);
router.delete('/:id', cinemaController.remove);

export default router;
