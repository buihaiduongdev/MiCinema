/**
 * Validate Middleware — Zod Schema Generic
 * 
 * Dùng: import { ZodSchema } from 'zod'
 * 
 * validate(schema: ZodSchema): middleware
 * - schema.safeParse(req.body)
 * - Nếu lỗi → 400 + errors chi tiết
 * - Nếu OK → req.body = result.data (đã clean/transform) → next()
 * 
 * VD: router.post('/movies', validate(createMovieSchema), movieController.create)
 */
