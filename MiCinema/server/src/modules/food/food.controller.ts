import { Request, Response } from 'express';
import { foodService } from './food.service';
import { responseSuccess, responseError } from '@/utils/response';
import { ProductCategory } from '@/models/Product.model';

export class FoodController {
  async create(req: Request, res: Response) {
    try {
      const product = await foodService.create(req.body);
      res.status(201).json(responseSuccess(product, 'Tạo sản phẩm thành công'));
    } catch (error: any) {
      res
        .status(400)
        .json(responseError(error.message || 'Tạo sản phẩm thất bại'));
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const { category, isActive } = req.query;
      const filter: any = {};

      if (category) {
        filter.category = category as ProductCategory;
      }

      if (isActive !== undefined) {
        filter.isActive = isActive === 'true';
      }

      const products = await foodService.getAll(filter);
      res.json(responseSuccess(products));
    } catch (error: any) {
      res
        .status(500)
        .json(responseError(error.message || 'Lấy danh sách sản phẩm thất bại'));
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const product = await foodService.getById(req.params.id as string);
      if (!product) {
        return res.status(404).json(responseError('Không tìm thấy sản phẩm'));
      }
      res.json(responseSuccess(product));
    } catch (error: any) {
      res
        .status(500)
        .json(responseError(error.message || 'Lấy thông tin sản phẩm thất bại'));
    }
  }

  async update(req: Request, res: Response) {
    try {
      const product = await foodService.update(
        req.params.id as string,
        req.body
      );
      if (!product) {
        return res.status(404).json(responseError('Không tìm thấy sản phẩm'));
      }
      res.json(responseSuccess(product, 'Cập nhật sản phẩm thành công'));
    } catch (error: any) {
      res
        .status(400)
        .json(responseError(error.message || 'Cập nhật sản phẩm thất bại'));
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const success = await foodService.delete(req.params.id as string);
      if (!success) {
        return res.status(404).json(responseError('Không tìm thấy sản phẩm'));
      }
      res.json(responseSuccess(null, 'Xóa sản phẩm thành công'));
    } catch (error: any) {
      res.status(400).json(responseError(error.message || 'Xóa sản phẩm thất bại'));
    }
  }

  async getActiveProducts(req: Request, res: Response) {
    try {
      const products = await foodService.getActiveProducts();
      res.json(responseSuccess(products));
    } catch (error: any) {
      res
        .status(500)
        .json(responseError(error.message || 'Lấy danh sách sản phẩm thất bại'));
    }
  }
}

export const foodController = new FoodController();
