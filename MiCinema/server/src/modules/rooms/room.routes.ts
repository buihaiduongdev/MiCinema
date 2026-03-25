import { Router } from 'express';
import { roomController } from './room.controller';

const router = Router();

router.get('/', roomController.getAll.bind(roomController));
router.get('/:id', roomController.getById.bind(roomController));
router.post('/', roomController.create.bind(roomController));
router.put('/:id', roomController.update.bind(roomController));
router.delete('/:id', roomController.delete.bind(roomController));
router.put(
  '/:roomId/seats/:seatId',
  roomController.updateSeat.bind(roomController)
);

export default router;
