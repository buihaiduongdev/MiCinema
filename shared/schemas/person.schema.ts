import z from 'zod';
import { PERSON_ROLE } from '../constants/person-roles.js';

/**
 * Schema tạo mới Person (Actor / Director)
 */
export const createPersonSchema = z.object({
  name: z.string().min(1, 'Tên là bắt buộc').max(200),
  avatar: z.string().url('URL ảnh không hợp lệ').optional().or(z.literal('')),
  images: z.array(z.string().url()).default([]),
  nationality: z.string().max(100).optional(),
  biography: z.string().max(2000).optional(),
  birthDate: z.string().datetime().optional(),
  height: z.number().int().optional(),
  roles: z
    .array(z.nativeEnum(PERSON_ROLE))
    .min(1, 'Phải có ít nhất 1 vai trò (ACTOR hoặc DIRECTOR)'),
});

export const updatePersonSchema = createPersonSchema.partial();

export const personFilterSchema = z.object({
  search: z.string().optional(),
  role: z.nativeEnum(PERSON_ROLE).optional(),
  nationality: z.string().optional(),
  sortBy: z.enum(['name', 'viewCount', 'createdAt']).default('viewCount'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

export type CreatePersonInput = z.infer<typeof createPersonSchema>;
export type UpdatePersonInput = z.infer<typeof updatePersonSchema>;
export type PersonFilter = z.infer<typeof personFilterSchema>;
