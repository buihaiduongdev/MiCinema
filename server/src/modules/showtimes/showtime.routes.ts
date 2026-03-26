import { Router } from 'express';
import { showtimeController } from './showtime.controller';

const router = Router();

router.post('/', showtimeController.create.bind(showtimeController));
router.get('/:id', showtimeController.getById.bind(showtimeController));
router.get('/:id/seats', showtimeController.getSeatMap.bind(showtimeController));
router.post('/:id/seats/hold', showtimeController.holdSeats.bind(showtimeController));
router.delete('/:id/seats/hold', showtimeController.releaseSeats.bind(showtimeController));

export default router;
