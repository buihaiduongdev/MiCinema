import { Request, Response } from 'express';
import { bookingService } from './booking.service';
import { responseSuccess, responseError } from '@/utils/response';

export class BookingController {
  async create(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json(responseError('Chưa đăng nhập'));
      }

      const booking = await bookingService.create({
        userId,
        ...req.body,
      });

      res.status(201).json(responseSuccess(booking, 'Tạo đơn đặt vé thành công'));
    } catch (error: any) {
      res
        .status(400)
        .json(responseError(error.message || 'Tạo đơn đặt vé thất bại'));
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const booking = await bookingService.getById(req.params.id as string);
      if (!booking) {
        return res.status(404).json(responseError('Không tìm thấy đơn đặt vé'));
      }
      res.json(responseSuccess(booking));
    } catch (error: any) {
      res
        .status(500)
        .json(responseError(error.message || 'Lấy thông tin đơn đặt vé thất bại'));
    }
  }

  async confirm(req: Request, res: Response) {
    try {
      const booking = await bookingService.confirm({
        bookingId: req.params.id as string,
        paymentMethod: req.body.paymentMethod,
      });

      res.json(responseSuccess(booking, 'Xác nhận thanh toán thành công'));
    } catch (error: any) {
      res
        .status(400)
        .json(responseError(error.message || 'Xác nhận thanh toán thất bại'));
    }
  }

  async cancel(req: Request, res: Response) {
    try {
      const booking = await bookingService.cancel(req.params.id as string);
      res.json(responseSuccess(booking, 'Hủy đơn đặt vé thành công'));
    } catch (error: any) {
      res
        .status(400)
        .json(responseError(error.message || 'Hủy đơn đặt vé thất bại'));
    }
  }

  async getUserBookings(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json(responseError('Chưa đăng nhập'));
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await bookingService.getUserBookings(userId, {
        page,
        limit,
      });

      res.json(responseSuccess(result));
    } catch (error: any) {
      res
        .status(500)
        .json(responseError(error.message || 'Lấy lịch sử đặt vé thất bại'));
    }
  }
}

export const bookingController = new BookingController();
