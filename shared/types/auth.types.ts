/**
 * Auth Types — infer từ Zod schemas + thêm server-side fields
 * 
 * Export:
 * - User = { _id, email, hoTen, soDienThoai?, avatar?, vaiTro, trangThai }
 * - LoginInput = z.infer<typeof loginSchema>
 * - RegisterInput = z.infer<typeof registerSchema>
 * - AuthResponse = { user: User; token: string }
 */
