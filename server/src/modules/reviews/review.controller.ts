/**
 * Reviews Controller — CRUD đánh giá phim
 *
 * Dùng: import schemas từ @shared/schemas/review.schema
 * Validate: dùng validate.middleware
 * Response: dùng utils/response.ts helper
 * Auth: req.user từ auth.middleware
 */

import { Request, Response } from 'express';
import * as reviewService from './review.service.js';
import { responseSuccess } from '../../utils/response.js';

/**
 * POST /api/reviews — Tạo đánh giá mới
 * Yêu cầu đăng nhập (protect)
 */
export const createReview = async (req: Request, res: Response) => {
  const review = await reviewService.create(req.user._id.toString(), req.body);
  res.status(201).json(responseSuccess(review, 'Gửi đánh giá thành công'));
};

/**
 * GET /api/reviews/movie/:movieId — Lấy danh sách review theo phim
 * Public
 */
export const getReviewsByMovie = async (req: Request, res: Response) => {
  const result = await reviewService.getByMovie(
    req.params.movieId as string,
    req.query as any,
  );
  res
    .status(200)
    .json(responseSuccess(result, 'Lấy danh sách đánh giá thành công'));
};

/**
 * GET /api/reviews/movie/:movieId/stats — Lấy thống kê rating của phim
 * Public
 */
export const getMovieRatingStats = async (req: Request, res: Response) => {
  const stats = await reviewService.getMovieRatingStats(
    req.params.movieId as string,
  );
  res.status(200).json(responseSuccess(stats));
};

/**
 * GET /api/reviews/movie/:movieId/my — Lấy review của user hiện tại cho phim
 * Yêu cầu đăng nhập
 */
export const getMyReviewForMovie = async (req: Request, res: Response) => {
  const review = await reviewService.getUserReviewForMovie(
    req.user._id.toString(),
    req.params.movieId as string,
  );
  res.status(200).json(responseSuccess(review));
};

/**
 * GET /api/reviews/my — Lấy tất cả review của user hiện tại
 * Yêu cầu đăng nhập
 */
export const getMyReviews = async (req: Request, res: Response) => {
  const result = await reviewService.getByUser(
    req.user._id.toString(),
    req.query as any,
  );
  res
    .status(200)
    .json(responseSuccess(result, 'Lấy lịch sử đánh giá thành công'));
};

/**
 * PUT /api/reviews/:id — Cập nhật đánh giá (chỉ owner)
 * Yêu cầu đăng nhập
 */
export const updateReview = async (req: Request, res: Response) => {
  const review = await reviewService.update(
    req.params.id as string,
    req.user._id.toString(),
    req.body,
  );
  res.status(200).json(responseSuccess(review, 'Cập nhật đánh giá thành công'));
};

/**
 * DELETE /api/reviews/:id — Xóa đánh giá (owner hoặc admin)
 * Yêu cầu đăng nhập
 */
export const deleteReview = async (req: Request, res: Response) => {
  await reviewService.remove(
    req.params.id as string,
    req.user._id.toString(),
    req.user.role,
  );
  res.status(200).json(responseSuccess(null, 'Xóa đánh giá thành công'));
};
