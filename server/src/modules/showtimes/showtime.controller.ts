/**
 * Showtimes Controller — CRUD lịch chiếu (tạo, sửa, huỷ suất chiếu)
 *
 * Dùng: import schemas từ @shared/schemas/showtime.schema
 * Validate: schema.safeParse(req.body) hoặc dùng validate.middleware
 * Response: dùng utils/response.ts helper
 * Auth: req.user từ auth.middleware
 */

import { Request, Response } from 'express';
import * as showtimeService from './showtime.service.js';
import { responseSuccess } from '../../utils/response.js';

/**
 * POST /api/showtimes — Tạo suất chiếu mới
 * UC-21: Chọn phim + phòng + giờ chiếu + giá vé
 */
export const createShowtime = async (req: Request, res: Response) => {
  const showtime = await showtimeService.create(req.body);
  res.status(201).json(responseSuccess(showtime, 'Tạo suất chiếu thành công'));
};

/**
 * GET /api/showtimes — Lấy danh sách suất chiếu
 * UC-04: Xem lịch chiếu theo ngày, phòng, giờ
 */
export const getShowtimes = async (req: Request, res: Response) => {
  const result = await showtimeService.getAll(req.query as any);
  res
    .status(200)
    .json(responseSuccess(result, 'Lấy danh sách suất chiếu thành công'));
};

/**
 * GET /api/showtimes/:id — Chi tiết suất chiếu
 */
export const getShowtimeById = async (req: Request, res: Response) => {
  const showtime = await showtimeService.getById(req.params.id as string);
  res.status(200).json(responseSuccess(showtime));
};

/**
 * GET /api/showtimes/movie/:movieId — Suất chiếu theo phim
 * UC-04: Xem lịch chiếu phim (nhóm theo ngày)
 */
export const getShowtimesByMovie = async (req: Request, res: Response) => {
  const cinemaId = req.query.cinemaId as string | undefined;
  const data = await showtimeService.getByMovie(
    req.params.movieId as string,
    cinemaId,
  );
  res
    .status(200)
    .json(responseSuccess(data, 'Lấy lịch chiếu phim thành công'));
};

/**
 * GET /api/showtimes/cinema/:cinemaId — Suất chiếu theo chi nhánh
 */
export const getShowtimesByCinema = async (req: Request, res: Response) => {
  const date = req.query.date as string | undefined;
  const data = await showtimeService.getByCinema(
    req.params.cinemaId as string,
    date,
  );
  res
    .status(200)
    .json(responseSuccess(data, 'Lấy lịch chiếu chi nhánh thành công'));
};

/**
 * PUT /api/showtimes/:id — Cập nhật suất chiếu
 * UC-22: Đổi giờ, giá vé (chỉ khi chưa có ai đặt)
 */
export const updateShowtime = async (req: Request, res: Response) => {
  const showtime = await showtimeService.update(
    req.params.id as string,
    req.body,
  );
  res
    .status(200)
    .json(responseSuccess(showtime, 'Cập nhật suất chiếu thành công'));
};

/**
 * DELETE /api/showtimes/:id/cancel — Huỷ suất chiếu
 * UC-23: Huỷ suất chiếu + tự động hoàn vé cho KH
 */
export const cancelShowtime = async (req: Request, res: Response) => {
  const result = await showtimeService.cancel(req.params.id as string);
  res.status(200).json(
    responseSuccess(
      result,
      `Huỷ suất chiếu thành công. ${result.cancelledBookings} vé đã được huỷ.`,
    ),
  );
};
