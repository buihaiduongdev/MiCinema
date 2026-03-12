import { z } from 'zod';

export const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, {
  message: 'ID không hợp lệ',
});

export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

export const listQuerySchema = paginationSchema.extend({
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type PaginationParams = z.infer<typeof paginationSchema>;
export type ListQueryParams = z.infer<typeof listQuerySchema>;
