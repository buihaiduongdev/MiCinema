import z from 'zod';

/**
 * Schema tạo mới Genre (Thể loại phim)
 */
export const createGenreSchema = z.object({
  name: z.string().min(1, 'Tên thể loại là bắt buộc').max(100),
  description: z.string().max(500).optional(),
});

export const updateGenreSchema = createGenreSchema.partial();

export type CreateGenreInput = z.infer<typeof createGenreSchema>;
export type UpdateGenreInput = z.infer<typeof updateGenreSchema>;
