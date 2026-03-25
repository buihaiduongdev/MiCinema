import { Router } from 'express';
import { foodController } from './food.controller';

const router = Router();

router.get('/', foodController.getAll.bind(foodController));
router.get('/active', foodController.getActiveProducts.bind(foodController));
router.get('/:id', foodController.getById.bind(foodController));
router.post('/', foodController.create.bind(foodController));
router.put('/:id', foodController.update.bind(foodController));
router.delete('/:id', foodController.delete.bind(foodController));

export default router;
