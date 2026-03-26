/**
 * Genre Routes — CRUD Thể loại phim
 *
 * Public:  GET    /api/genres           — Tất cả thể loại
 * Public:  GET    /api/genres/:id       — Chi tiết
 * Staff+:  POST   /api/genres           — Tạo mới
 * Staff+:  PUT    /api/genres/:id       — Cập nhật
 * Staff+:  DELETE /api/genres/:id       — Xóa (soft delete)
 */

import { Router } from 'express';
import * as genreController from './genre.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { protect, restrictTo } from '../../middlewares/auth.middleware.js';
import {
  createGenreSchema,
  updateGenreSchema,
} from '@shared/schemas/genre.schema.js';

const router = Router();

// --- PUBLIC ROUTES ---
router.get('/', genreController.getAll);
router.get('/:id', genreController.getById);

// --- PROTECTED ROUTES (Staff + Admin) ---
router.use(protect);
router.use(restrictTo('STAFF', 'ADMIN'));

router.post('/', validate(createGenreSchema), genreController.create);
router.put('/:id', validate(updateGenreSchema), genreController.update);
router.delete('/:id', genreController.remove);

export default router;
