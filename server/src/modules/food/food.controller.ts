import { Request, Response } from 'express';
import * as foodService from './food.service.js';
import { responseSuccess } from '../../utils/response.js';
import type {
  CreateComboInput,
  CreateProductInput,
  FoodOrderListQuery,
  PatchProductInput,
  ProductListQuery,
} from '@shared/schemas/food.schema.js';

export const createProduct = async (req: Request, res: Response) => {
  const product = await foodService.createProduct(req.body as CreateProductInput);
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
  res.status(200).json(responseSuccess(product, 'Cập nhật sản phẩm thành công'));
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
