import { z } from 'zod';
import { objectIdSchema } from './common.schema.js';

/**
 * Schema tạo review mới
 * rating: 1-10 (tương thích với rating system của Movie model)
 * comment: nội dung bình luận (tùy chọn)
 */
export const createReviewSchema = z.object({
  movieId: objectIdSchema,
  rating: z.number().int().min(1, 'Đánh giá tối thiểu 1 sao').max(10, 'Đánh giá tối đa 10 sao'),
  comment: z.string().max(1000, 'Bình luận tối đa 1000 ký tự').optional().or(z.literal('')),
});

export const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(10).optional(),
  comment: z.string().max(1000).optional().or(z.literal('')),
});

/**
 * Schema lọc review — dùng cho query params
 */
export const reviewFilterSchema = z.object({
  movieId: z.string().optional(),
  userId: z.string().optional(),
  sortBy: z.enum(['rating', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
export type ReviewFilter = z.infer<typeof reviewFilterSchema>;
