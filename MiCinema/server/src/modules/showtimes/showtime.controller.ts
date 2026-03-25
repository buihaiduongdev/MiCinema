import { Request, Response } from 'express';
import { showtimeService } from './showtime.service';
import { responseSuccess, responseError } from '@/utils/response';

export class ShowtimeController {
  async create(req: Request, res: Response) {
    try {
      const showtime = await showtimeService.create(req.body);
      res
        .status(201)
        .json(responseSuccess(showtime, 'Tạo suất chiếu thành công'));
    } catch (error: any) {
      res
        .status(400)
        .json(responseError(error.message || 'Tạo suất chiếu thất bại'));
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const showtime = await showtimeService.getById(req.params.id as string);
      if (!showtime) {
        return res.status(404).json(responseError('Không tìm thấy suất chiếu'));
      }
      res.json(responseSuccess(showtime));
    } catch (error: any) {
      res
        .status(500)
        .json(responseError(error.message || 'Lấy thông tin suất chiếu thất bại'));
    }
  }

  async getSeatMap(req: Request, res: Response) {
    try {
      const seatMap = await showtimeService.getSeatMap(req.params.id as string);
      res.json(responseSuccess(seatMap));
    } catch (error: any) {
      res
        .status(500)
        .json(responseError(error.message || 'Lấy sơ đồ ghế thất bại'));
    }
  }

  async holdSeats(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json(responseError('Chưa đăng nhập'));
      }

      const { seats } = req.body;
      await showtimeService.holdSeats({
        showtimeId: req.params.id as string,
        seats,
        userId,
      });

      res.json(responseSuccess(null, 'Giữ ghế thành công'));
    } catch (error: any) {
      res.status(400).json(responseError(error.message || 'Giữ ghế thất bại'));
    }
  }

  async releaseSeats(req: Request, res: Response) {
    try {
      const { seats } = req.body;
      await showtimeService.releaseSeats(req.params.id as string, seats);
      res.json(responseSuccess(null, 'Hủy giữ ghế thành công'));
    } catch (error: any) {
      res.status(400).json(responseError(error.message || 'Hủy giữ ghế thất bại'));
    }
  }
}

export const showtimeController = new ShowtimeController();
