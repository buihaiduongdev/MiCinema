/**
 * Food — UC-46..49 (admin)
 */

import { Router } from 'express';
import * as foodController from './food.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { protect, restrictTo } from '../../middlewares/auth.middleware.js';
import { uploadSingle } from '../../middlewares/upload.middleware.js';
import {
  createComboSchema,
  createProductSchema,
  foodOrderListQuerySchema,
  patchProductSchema,
  productListQuerySchema,
  productIdParamsSchema,
  createFoodOrderSchema,
} from '@shared/schemas/food.schema.js';

const router = Router();

router.use(protect);
router.post(
  '/orders',
  validate({ body: createFoodOrderSchema }),
  foodController.createFoodOrder,
);
router.get(
  '/orders/by-booking/:bookingId',
  foodController.getFoodOrdersByBooking,
);
router.post('/orders/:orderId/pay', foodController.createFoodPayment);
router.patch('/orders/:orderId/simulate-paid', foodController.simulatePaid);

/**
 * TEMP — test upload: chỉ cần JWT (protect), không cần ADMIN.
 * Khi test xong: xóa block này và đặt lại `POST /upload-image` ngay sau `router.use(restrictTo('ADMIN'))`.
 */
router.post(
  '/upload-image',
  uploadSingle('image'),
  foodController.uploadProductImage,
);

router.use(restrictTo('ADMIN'));

router.get(
  '/orders',
  validate({ query: foodOrderListQuerySchema }),
  foodController.listFoodOrders,
);

router.get(
  '/products',
  validate({ query: productListQuerySchema }),
  foodController.listProducts,
);
router.post(
  '/products',
  validate(createProductSchema),
  foodController.createProduct,
);

router.post('/combos', validate(createComboSchema), foodController.createCombo);

const idParams = validate({ params: productIdParamsSchema });
const updateProductHandlers = [
  idParams,
  validate({ body: patchProductSchema }),
  foodController.updateProduct,
] as const;

router.get('/products/:id', idParams, foodController.getProductById);
router.patch('/products/:id', ...updateProductHandlers);
/** Một số môi trường / client chỉ chuyển PUT ổn định hơn PATCH */
router.put('/products/:id', ...updateProductHandlers);
router.delete('/products/:id', idParams, foodController.deactivateProduct);

export default router;
