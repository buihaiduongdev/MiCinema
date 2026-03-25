/**
 * Movies Controller — CRUD phim (thêm, sửa, xoá, lấy danh sách)
 *
 * Dùng: import schemas từ @shared/schemas/movie.schema
 * Validate: schema.safeParse(req.body) hoặc dùng validate.middleware
 * Response: dùng utils/response.ts helper
 * Auth: req.user từ auth.middleware
 */

import { Request, Response } from 'express';
import * as movieService from './movie.service.js';
import { responseSuccess } from '../../utils/response.js';

/**
 * POST /api/movies — Tạo phim mới
 * UC-18: Nhập thông tin phim, upload poster, trailer
 */
export const createMovie = async (req: Request, res: Response) => {
  const movie = await movieService.create(req.body);
  res.status(201).json(responseSuccess(movie, 'Tạo phim thành công'));
};

/**
 * GET /api/movies — Lấy danh sách phim
 * UC-02: Lọc theo thể loại, trạng thái
 * UC-05: Tìm theo tên phim, thể loại, đạo diễn
 */
export const getMovies = async (req: Request, res: Response) => {
  const result = await movieService.getAll(req.query as any);
  res
    .status(200)
    .json(responseSuccess(result, 'Lấy danh sách phim thành công'));
};

/**
 * GET /api/movies/now-showing — Phim đang chiếu
 * UC-01: Trang chủ
 */
export const getNowShowing = async (req: Request, res: Response) => {
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  const data = await movieService.getNowShowing(limit);
  res.status(200).json(responseSuccess(data, 'Lấy phim đang chiếu thành công'));
};

/**
 * GET /api/movies/upcoming — Phim sắp chiếu
 * UC-03c: Coming Soon
 */
export const getUpcoming = async (req: Request, res: Response) => {
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  const data = await movieService.getUpcoming(limit);
  res.status(200).json(responseSuccess(data, 'Lấy phim sắp chiếu thành công'));
};

/**
 * GET /api/movies/:id — Chi tiết phim
 * UC-03: Xem poster, trailer, mô tả, đạo diễn, diễn viên
 */
export const getMovieById = async (req: Request, res: Response) => {
  const movie = await movieService.getById(req.params.id);
  res.status(200).json(responseSuccess(movie));
};

/**
 * GET /api/movies/slug/:slug — Chi tiết phim theo slug (SEO)
 */
export const getMovieBySlug = async (req: Request, res: Response) => {
  const movie = await movieService.getBySlug(req.params.slug);
  res.status(200).json(responseSuccess(movie));
};

/**
 * GET /api/movies/:id/related — Phim liên quan
 * UC-03b: Gợi ý phim cùng thể loại
 */
export const getRelatedMovies = async (req: Request, res: Response) => {
  const limit = req.query.limit ? Number(req.query.limit) : 6;
  const data = await movieService.getRelated(req.params.id, limit);
  res.status(200).json(responseSuccess(data, 'Lấy phim liên quan thành công'));
};

/**
 * PUT /api/movies/:id — Cập nhật phim
 * UC-19: Cập nhật thông tin, đổi poster, thay đổi trạng thái
 */
export const updateMovie = async (req: Request, res: Response) => {
  const movie = await movieService.update(req.params.id, req.body);
  res.status(200).json(responseSuccess(movie, 'Cập nhật phim thành công'));
};

/**
 * DELETE /api/movies/:id — Xóa phim
 * UC-20: Xóa phim (chỉ khi chưa có suất chiếu)
 */
export const deleteMovie = async (req: Request, res: Response) => {
  await movieService.remove(req.params.id);
  res.status(200).json(responseSuccess(null, 'Xóa phim thành công'));
};
