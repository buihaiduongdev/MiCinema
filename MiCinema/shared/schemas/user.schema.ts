import z from 'zod';
import { ROLES } from '../constants/roles.js';
import { MEMBERSHIP_TIER } from '../constants/statuses.js';

export const userSchema = z.object({
  email: z.string().email('Không đúng định dạng email'),
  password: z.string().min(6, 'Mật khẩu phải có tối thiểu 6 ký tự'),
  fullName: z.string().min(1, 'Họ tên là bắt buộc').max(100),
  phone: z.string().max(20).optional(),
  avatar: z.string().url().optional().or(z.literal('')),
  role: z.nativeEnum(ROLES).default(ROLES.CUSTOMER),
  isActive: z.boolean().default(true),
  loyaltyPoints: z.number().int().nonnegative().default(0),
  membershipTier: z.nativeEnum(MEMBERSHIP_TIER).default(MEMBERSHIP_TIER.BRONZE),
});

export const updateProfileSchema = userSchema
  .pick({
    fullName: true,
    phone: true,
    avatar: true,
  })
  .partial();

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

export type User = z.infer<typeof userSchema>;
