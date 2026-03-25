/**
 * Cinema Controller — CRUD Chi nhánh rạp
 *
 * Dùng: import schemas từ @shared/schemas/cinema.schema
 * Validate: dùng validate.middleware
 * Response: dùng utils/response.ts helper
 * Auth: req.user từ auth.middleware
 */

import { Request, Response } from 'express';
import * as cinemaService from './cinema.service.js';
import { responseSuccess } from '../../utils/response.js';

export const create = async (req: Request, res: Response) => {
  const cinema = await cinemaService.create(req.body);
  res.status(201).json(responseSuccess(cinema, 'Tạo chi nhánh thành công'));
};

export const getAll = async (req: Request, res: Response) => {
  const result = await cinemaService.getAll(req.query as any);
  res
    .status(200)
    .json(responseSuccess(result, 'Lấy danh sách chi nhánh thành công'));
};

export const getById = async (req: Request, res: Response) => {
  const cinema = await cinemaService.getById(req.params.id as string);
  res.status(200).json(responseSuccess(cinema));
};

export const getBySlug = async (req: Request, res: Response) => {
  const cinema = await cinemaService.getBySlug(req.params.slug as string);
  res.status(200).json(responseSuccess(cinema));
};

export const update = async (req: Request, res: Response) => {
  const cinema = await cinemaService.update(req.params.id as string, req.body);
  res.status(200).json(responseSuccess(cinema, 'Cập nhật chi nhánh thành công'));
};

export const remove = async (req: Request, res: Response) => {
  await cinemaService.remove(req.params.id as string);
  res.status(200).json(responseSuccess(null, 'Xóa chi nhánh thành công'));
};

export const getCities = async (req: Request, res: Response) => {
  const cities = await cinemaService.getCities();
  res
    .status(200)
    .json(responseSuccess(cities, 'Lấy danh sách thành phố thành công'));
};
