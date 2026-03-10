/**
 * User Validation Schemas (Zod)
 * 
 * Export:
 * - updateProfileSchema: z.object({ hoTen, soDienThoai?, avatar? })
 * - changePasswordSchema: z.object({ matKhauCu, matKhauMoi, xacNhanMatKhau })
 *   .refine(data => data.matKhauMoi === data.xacNhanMatKhau)
 * 
 * Type exports:
 * - UpdateProfileInput, ChangePasswordInput
 */
