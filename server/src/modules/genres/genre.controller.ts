/**
 * Genre Controller — CRUD Thể loại phim
 *
 * Dùng: import schemas từ @shared/schemas/genre.schema
 * Validate: dùng validate.middleware
 * Response: dùng utils/response.ts helper
 * Auth: req.user từ auth.middleware
 */

import { Request, Response } from 'express';
import * as genreService from './genre.service.js';
import { responseSuccess } from '../../utils/response.js';

export const create = async (req: Request, res: Response) => {
  const genre = await genreService.create(req.body);
  res.status(201).json(responseSuccess(genre, 'Tạo thể loại thành công'));
};

export const getAll = async (req: Request, res: Response) => {
  const data = await genreService.getAll();
  res
    .status(200)
    .json(responseSuccess(data, 'Lấy danh sách thể loại thành công'));
};

export const getById = async (req: Request, res: Response) => {
  const genre = await genreService.getById(req.params.id);
  res.status(200).json(responseSuccess(genre));
};

export const update = async (req: Request, res: Response) => {
  const genre = await genreService.update(req.params.id, req.body);
  res.status(200).json(responseSuccess(genre, 'Cập nhật thể loại thành công'));
};

export const remove = async (req: Request, res: Response) => {
  await genreService.remove(req.params.id);
  res.status(200).json(responseSuccess(null, 'Xóa thể loại thành công'));
};
