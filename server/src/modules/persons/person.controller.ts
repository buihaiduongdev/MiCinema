/**
 * Person Controller — CRUD Actor/Director
 *
 * Dùng: import schemas từ @shared/schemas/person.schema
 * Validate: dùng validate.middleware
 * Response: dùng utils/response.ts helper
 * Auth: req.user từ auth.middleware
 */

import { Request, Response } from 'express';
import * as personService from './person.service.js';
import { responseSuccess } from '../../utils/response.js';

export const create = async (req: Request, res: Response) => {
  const person = await personService.create(req.body);
  res.status(201).json(responseSuccess(person, 'Tạo thành công'));
};

export const getAll = async (req: Request, res: Response) => {
  const result = await personService.getAll(req.query as any);
  res.status(200).json(responseSuccess(result, 'Lấy danh sách thành công'));
};

export const getById = async (req: Request, res: Response) => {
  const person = await personService.getById(req.params.id);
  res.status(200).json(responseSuccess(person));
};

export const update = async (req: Request, res: Response) => {
  const person = await personService.update(req.params.id, req.body);
  res.status(200).json(responseSuccess(person, 'Cập nhật thành công'));
};

export const remove = async (req: Request, res: Response) => {
  await personService.remove(req.params.id);
  res.status(200).json(responseSuccess(null, 'Xóa thành công'));
};
