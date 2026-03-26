import z from 'zod';
import { MOVIE_STATUS } from '../constants/statuses.js';
import { AGE_RATING, AUDIO_TYPE } from '../constants/movie-constants.js';
import { objectIdSchema } from './common.schema.js';

/**
 * Schema tạo phim mới
 * poster là URL string (upload poster riêng hoặc dùng CDN)
 */
export const createMovieSchema = z.object({
  title: z.string().min(1, 'Tên phim là bắt buộc').max(300),
  description: z.string().min(1, 'Mô tả là bắt buộc').max(5000),
  directors: z.array(objectIdSchema).min(1, 'Phải có ít nhất 1 đạo diễn'),
  actors: z.array(objectIdSchema).default([]),
  genres: z.array(objectIdSchema).min(1, 'Phải có ít nhất 1 thể loại'),
  duration: z.number().int().min(1, 'Thời lượng phải > 0 phút'),
  releaseDate: z.string().datetime('Ngày khởi chiếu không hợp lệ'),
  endDate: z.string().datetime().optional(),
  poster: z.string().url('URL poster không hợp lệ'),
  trailer: z
    .string()
    .url('URL trailer không hợp lệ')
    .optional()
    .or(z.literal('')),
  language: z.string().min(1, 'Ngôn ngữ gốc là bắt buộc'),
  audioType: z.nativeEnum(AUDIO_TYPE).default(AUDIO_TYPE.SUBTITLED),
  ageRating: z.nativeEnum(AGE_RATING).default(AGE_RATING.P),
  country: z.string().max(100).optional(),
});

export const updateMovieSchema = createMovieSchema.partial();

/**
 * Schema lọc phim — dùng cho query params
 * Tất cả coerce vì query params luôn là string
 */
export const movieFilterSchema = z.object({
  search: z.string().optional(),
  genre: z.string().optional(), // genreId
  director: z.string().optional(), // personId
  actor: z.string().optional(), // personId
  status: z.nativeEnum(MOVIE_STATUS).optional(),
  ageRating: z.nativeEnum(AGE_RATING).optional(),
  audioType: z.nativeEnum(AUDIO_TYPE).optional(),
  country: z.string().optional(), // Lọc theo quốc gia
  year: z.coerce.number().optional(), // Lọc theo năm phát hành
  sortBy: z
    .enum(['title', 'releaseDate', 'rating', 'viewCount', 'createdAt'])
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

export const movieSchema = createMovieSchema.extend({
  _id: z.string(),
  slug: z.string(),
  rating: z.number().default(0),
  viewCount: z.number().default(0),
  status: z.nativeEnum(MOVIE_STATUS).default(MOVIE_STATUS.UPCOMING),
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()),
});

export type CreateMovieInput = z.infer<typeof createMovieSchema>;
export type UpdateMovieInput = z.infer<typeof updateMovieSchema>;
export type MovieFilter = z.infer<typeof movieFilterSchema>;
export type MovieType = z.infer<typeof movieSchema>;
