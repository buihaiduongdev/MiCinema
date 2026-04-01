import { Request, Response } from 'express';
import * as foodService from './food.service.js';
import { responseError, responseSuccess } from '../../utils/response.js';
import type {
  CreateComboInput,
  CreateFoodOrderInput,
  CreateProductInput,
  FoodOrderListQuery,
  PatchProductInput,
  ProductListQuery,
} from '@shared/schemas/food.schema.js';
import { FOOD_ORDER_STATUS } from '@shared/constants/statuses.js';

/** Upload ảnh sản phẩm/combo — trả về đường dẫn public `/uploads/...` */
export const uploadProductImage = async (req: Request, res: Response) => {
  const file = req.file;
  if (!file?.filename) {
    return res.status(400).json(responseError('Không có file ảnh'));
  }
  const url = `/uploads/${file.filename}`;
  res.status(200).json(responseSuccess({ url }, 'Upload ảnh thành công'));
};

export const createProduct = async (req: Request, res: Response) => {
  const product = await foodService.createProduct(
    req.body as CreateProductInput,
  );
  res.status(201).json(responseSuccess(product, 'Thêm sản phẩm thành công'));
};

export const createCombo = async (req: Request, res: Response) => {
  const combo = await foodService.createCombo(req.body as CreateComboInput);
  res.status(201).json(responseSuccess(combo, 'Thêm combo thành công'));
};

export const listProducts = async (req: Request, res: Response) => {
  const result = await foodService.listProducts(
    req.query as unknown as ProductListQuery,
  );
  res
    .status(200)
    .json(responseSuccess(result, 'Lấy danh sách sản phẩm thành công'));
};

export const getProductById = async (req: Request, res: Response) => {
  const product = await foodService.getProductById(req.params.id as string);
  res.status(200).json(responseSuccess(product, 'Lấy sản phẩm thành công'));
};

export const updateProduct = async (req: Request, res: Response) => {
  const product = await foodService.updateProduct(
    req.params.id as string,
    req.body as PatchProductInput,
  );
  res
    .status(200)
    .json(responseSuccess(product, 'Cập nhật sản phẩm thành công'));
};

export const deactivateProduct = async (req: Request, res: Response) => {
  const result = await foodService.deactivateProduct(req.params.id as string);
  res.status(200).json(responseSuccess(result, 'Đã ẩn sản phẩm'));
};

export const listFoodOrders = async (req: Request, res: Response) => {
  const result = await foodService.listFoodOrdersByShowtime(
    req.query as unknown as FoodOrderListQuery,
  );
  res
    .status(200)
    .json(responseSuccess(result, 'Lấy danh sách đơn đồ ăn thành công'));
};

export const createFoodOrder = async (req: Request, res: Response) => {
  const userId = (req as any).user._id;
  const order = req.body as CreateFoodOrderInput;
  const result = await foodService.createFoodOrder(userId, order);

  res.status(200).json(responseSuccess(result, 'Tạo đơn thành công'));
};

export const getFoodOrdersByBooking = async (req: Request, res: Response) => {
  const { bookingId } = req.params;
  const orders = await foodService.getFoodOrdersByBooking(bookingId as string);
  res
    .status(200)
    .json(responseSuccess(orders, 'Lấy danh sách đồ ăn thành công'));
};

export const createFoodPayment = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const order = await foodService.getFoodOrdersById(orderId as string);
  if (!order) throw new Error('Không tìm thấy đơn đồ ăn');
  const paymentUrl = `https://img.vietqr.io/image/970422-0345588112-compact2.jpg?amount=${order.totalAmount}&addInfo=MiCinema Food ${orderId}&accountName=BUI HAI DUONG`;

  res
    .status(200)
    .json(responseSuccess({ paymentUrl }, 'Tạo mã thanh toán thành công'));
};

export const simulatePaid = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const order = await foodService.updateOrderStatus(
    orderId as string,
    FOOD_ORDER_STATUS.PAID,
  );
  res.status(200).json(responseSuccess(order, 'Đã xác nhận thanh toán đồ ăn'));
};
