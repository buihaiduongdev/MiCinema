import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { ROLES } from '@shared/constants/roles.js';
import {
  ticketCheckInBodySchema,
  ticketRefundBodySchema,
} from '@shared/schemas/ticket.schema.js';
import { objectIdSchema } from '@shared/schemas/common.schema.js';
import * as ticketController from './ticket.controller.js';
import z from 'zod';

const router = Router();

router.use(protect);
router.use(restrictTo(ROLES.STAFF, ROLES.ADMIN));

router.post(
  '/check-in',
  validate(ticketCheckInBodySchema),
  ticketController.checkIn,
);

router.post(
  '/:ticketId/refund',
  validate({
    params: z.object({ ticketId: objectIdSchema }),
    body: ticketRefundBodySchema,
  }),
  ticketController.refund,
);

export default router;
