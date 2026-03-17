import { Router } from 'express';
import * as bookingController from './booking.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createBookingSchema } from '@shared/schemas/booking.schema.js';
import {
  objectIdSchema,
  paginationSchema,
} from '@shared/schemas/common.schema.js';
import z from 'zod';

const router = Router();

//PUBLIC
router.get(
  '/seats/:showtimeId',
  validate({ params: z.object({ showtimeId: objectIdSchema }) }),
  bookingController.getSeats,
);

//PROTECT
router.use(protect);

router.post(
  '/',
  validate(createBookingSchema),
  bookingController.createBooking,
);

router.get(
  '/my-bookings',
  validate({ query: paginationSchema }),
  bookingController.getMyBookings,
);

router.get(
  ':id',
  validate({ params: z.object({ id: objectIdSchema }) }),
  bookingController.getBookingDetail,
);

export default router;
