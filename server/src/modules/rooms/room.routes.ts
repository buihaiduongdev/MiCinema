/**
 * Rooms — Quản lý phòng chiếu (Admin)
 * UC-27 tạo phòng, UC-28 cấu hình ghế, UC-29 sửa / vô hiệu hóa
 */

import { Router } from 'express';
import * as roomController from './room.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { protect, restrictTo } from '../../middlewares/auth.middleware.js';
import {
  createRoomSchema,
  roomFilterSchema,
  roomIdParamsSchema,
  patchRoomSchema,
} from '@shared/schemas/room.schema.js';

const router = Router();

router.use(protect);
router.use(restrictTo('ADMIN'));

router.get(
  '/',
  validate({ query: roomFilterSchema }),
  roomController.getAll,
);
router.post('/', validate(createRoomSchema), roomController.create);

const idParams = validate({ params: roomIdParamsSchema });

router.get('/:id', idParams, roomController.getById);
router.patch(
  '/:id',
  idParams,
  validate({ body: patchRoomSchema }),
  roomController.patch,
);
router.delete('/:id', idParams, roomController.remove);

export default router;
