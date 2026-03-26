import z from 'zod';

/**
 * Schema tạo mới Cinema (Chi nhánh rạp)
 */
export const createCinemaSchema = z.object({
  name: z.string().min(1, 'Tên chi nhánh là bắt buộc').max(200),
  address: z.string().min(1, 'Địa chỉ là bắt buộc').max(500),
  city: z.string().min(1, 'Thành phố là bắt buộc').max(100),
  phone: z.string().max(20).optional(),
  email: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
  description: z.string().max(2000).optional(),
  images: z.array(z.string().url()).default([]),
  openingHours: z.string().max(200).optional(),
});

export const updateCinemaSchema = createCinemaSchema.partial();

export const cinemaFilterSchema = z.object({
  search: z.string().optional(),
  city: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export type CreateCinemaInput = z.infer<typeof createCinemaSchema>;
export type UpdateCinemaInput = z.infer<typeof updateCinemaSchema>;
export type CinemaFilter = z.infer<typeof cinemaFilterSchema>;
