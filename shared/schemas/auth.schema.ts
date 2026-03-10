/**
 * Auth Validation Schemas (Zod)
 * 
 * Dùng chung cho cả FE (React Hook Form) và BE (Express middleware).
 * 
 * Export:
 * - loginSchema: z.object({ email, matKhau })
 * - registerSchema: z.object({ email, matKhau, hoTen, soDienThoai? })
 * - changePasswordSchema: z.object({ matKhauCu, matKhauMoi })
 * 
 * Type exports (infer từ Zod):
 * - LoginInput = z.infer<typeof loginSchema>
 * - RegisterInput = z.infer<typeof registerSchema>
 * 
 * Sử dụng:
 * - FE: import { loginSchema } → zodResolver(loginSchema) trong useForm
 * - BE: import { loginSchema } → loginSchema.safeParse(req.body) trong controller
 */
