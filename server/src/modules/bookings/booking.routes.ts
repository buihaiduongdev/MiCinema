import { Router } from 'express';
import * as bookingController from './booking.controller.js';
import { protect, restrictTo } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import {
  adminBookingListQuerySchema,
  createBookingSchema,
} from '@shared/schemas/booking.schema.js';
import {
  objectIdSchema,
  paginationSchema,
} from '@shared/schemas/common.schema.js';
import { ROLES } from '@shared/constants/roles.js';
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
  '/admin',
  restrictTo(ROLES.STAFF, ROLES.ADMIN),
  validate({ query: adminBookingListQuerySchema }),
  bookingController.listBookingsAdmin,
);

router.patch(
  '/:id/confirm-payment',
  // restrictTo(ROLES.STAFF, ROLES.ADMIN),
  validate({ params: z.object({ id: objectIdSchema }) }),
  bookingController.confirmPayment,
);

router.get(
  '/:id',
  validate({ params: z.object({ id: objectIdSchema }) }),
  bookingController.getBookingDetail,
);

router.patch('/:id/cancel', bookingController.cancelBooking);

export default router;
