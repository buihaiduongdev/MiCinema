/**
 * Person Controller — CRUD Actor/Director
 * * Sử dụng:
 * - Request/Response từ express
 * - Các hàm nghiệp vụ từ person.service
 * - Type định nghĩa từ @shared/schemas/person.schema
 */

import { Request, Response } from 'express';
import * as personService from './person.service.js';
import { responseSuccess } from '../../utils/response.js';
import type {
  CreatePersonInput,
  UpdatePersonInput,
  PersonFilter,
} from '@shared/schemas/person.schema';

/**
 * Tạo mới Person
 */
export const create = async (req: Request, res: Response) => {
  // req.body đã được validate bởi middleware nên có kiểu là CreatePersonInput
  const data: CreatePersonInput = req.body;

  const person = await personService.create(data);

  return res
    .status(201)
    .json(
      responseSuccess(person, 'Tạo thông tin diễn viên/đạo diễn thành công'),
    );
};

/**
 * Lấy danh sách Person (có phân trang, lọc và Text Search)
 */
export const getAll = async (req: Request, res: Response) => {
  // Ép kiểu req.query về PersonFilter để Service nhận đúng các tham số
  // Dùng unknown làm trung gian để tránh lỗi ép kiểu trực tiếp trong TS
  const filter = req.query as unknown as PersonFilter;

  const result = await personService.getAll(filter);

  return res
    .status(200)
    .json(responseSuccess(result, 'Lấy danh sách thành công'));
};

/**
 * Lấy chi tiết một Person theo ID
 */
export const getById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const person = await personService.getById(id as string);

  return res.status(200).json(responseSuccess(person));
};

/**
 * Lấy chi tiết Person bằng slug
 */
export const getBySlug = async (req: Request, res: Response) => {
  const { slug } = req.params;
  const person = await personService.getBySlug(slug as string);
  return res.status(200).json(responseSuccess(person));
};

/**
 * Lấy danh sách quốc tịch của Person (cho dropdown filter)
 */
export const getNationalities = async (req: Request, res: Response) => {
  const role = req.query.role as string | undefined;
  const nationalities = await personService.getNationalities(role);
  return res.status(200).json(responseSuccess(nationalities));
};

/**
 * Cập nhật thông tin Person
 */
export const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data: UpdatePersonInput = req.body;

  const person = await personService.update(id as string, data);

  return res
    .status(200)
    .json(responseSuccess(person, 'Cập nhật thông tin thành công'));
};

/**
 * Xóa Person (Soft Delete)
 */
export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;

  await personService.remove(id as string);

  return res
    .status(200)
    .json(responseSuccess(null, 'Xóa thông tin thành công'));
};
