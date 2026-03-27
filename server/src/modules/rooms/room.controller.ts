import { Request, Response } from 'express';
import * as roomService from './room.service.js';
import { responseSuccess } from '../../utils/response.js';

export const create = async (req: Request, res: Response) => {
  const room = await roomService.create(req.body);
  res.status(201).json(responseSuccess(room, 'Tạo phòng chiếu thành công'));
};

export const getAll = async (req: Request, res: Response) => {
  const result = await roomService.getAll(req.query as any);
  res
    .status(200)
    .json(responseSuccess(result, 'Lấy danh sách phòng chiếu thành công'));
};

export const getById = async (req: Request, res: Response) => {
  const room = await roomService.getById(req.params.id as string);
  res.status(200).json(responseSuccess(room, 'Lấy phòng chiếu thành công'));
};

export const patch = async (req: Request, res: Response) => {
  const room = await roomService.update(req.params.id as string, req.body);
  res.status(200).json(responseSuccess(room, 'Cập nhật phòng chiếu thành công'));
};

export const remove = async (req: Request, res: Response) => {
  await roomService.deactivate(req.params.id as string);
  res
    .status(200)
    .json(responseSuccess(null, 'Đã vô hiệu hóa phòng chiếu'));
};
