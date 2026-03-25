import { Router } from 'express';
import { bookingController } from './booking.controller';

const router = Router();

router.post('/', bookingController.create.bind(bookingController));
router.get('/my-bookings', bookingController.getUserBookings.bind(bookingController));
router.get('/:id', bookingController.getById.bind(bookingController));
router.post('/:id/confirm', bookingController.confirm.bind(bookingController));
router.delete('/:id', bookingController.cancel.bind(bookingController));

export default router;
