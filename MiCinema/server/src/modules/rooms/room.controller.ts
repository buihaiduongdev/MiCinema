import { Request, Response } from 'express';
import { roomService } from './room.service';
import { responseSuccess, responseError } from '@/utils/response';

export class RoomController {
  async create(req: Request, res: Response) {
    try {
      const room = await roomService.create(req.body);
      res.status(201).json(responseSuccess(room, 'Tạo phòng chiếu thành công'));
    } catch (error: any) {
      res
        .status(400)
        .json(responseError(error.message || 'Tạo phòng chiếu thất bại'));
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const { isActive } = req.query;
      const filter: any = {};

      if (isActive !== undefined) {
        filter.isActive = isActive === 'true';
      }

      const rooms = await roomService.getAll(filter);
      res.json(responseSuccess(rooms));
    } catch (error: any) {
      res
        .status(500)
        .json(responseError(error.message || 'Lấy danh sách phòng thất bại'));
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const room = await roomService.getById(req.params.id as string);
      if (!room) {
        return res.status(404).json(responseError('Không tìm thấy phòng chiếu'));
      }
      res.json(responseSuccess(room));
    } catch (error: any) {
      res
        .status(500)
        .json(responseError(error.message || 'Lấy thông tin phòng thất bại'));
    }
  }

  async update(req: Request, res: Response) {
    try {
      const room = await roomService.update(req.params.id as string, req.body);
      if (!room) {
        return res.status(404).json(responseError('Không tìm thấy phòng chiếu'));
      }
      res.json(responseSuccess(room, 'Cập nhật phòng chiếu thành công'));
    } catch (error: any) {
      res
        .status(400)
        .json(responseError(error.message || 'Cập nhật phòng thất bại'));
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const success = await roomService.delete(req.params.id as string);
      if (!success) {
        return res.status(404).json(responseError('Không tìm thấy phòng chiếu'));
      }
      res.json(responseSuccess(null, 'Xóa phòng chiếu thành công'));
    } catch (error: any) {
      res.status(400).json(responseError(error.message || 'Xóa phòng thất bại'));
    }
  }

  async updateSeat(req: Request, res: Response) {
    try {
      const { roomId, seatId } = req.params;
      const room = await roomService.updateSeat(
        roomId as string,
        seatId as string,
        req.body
      );
      if (!room) {
        return res.status(404).json(responseError('Không tìm thấy phòng hoặc ghế'));
      }
      res.json(responseSuccess(room, 'Cập nhật ghế thành công'));
    } catch (error: any) {
      res
        .status(400)
        .json(responseError(error.message || 'Cập nhật ghế thất bại'));
    }
  }
}

export const roomController = new RoomController();
