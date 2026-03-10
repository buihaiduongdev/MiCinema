/**
 * Environment Variables — Zod validated
 * 
 * Dùng Zod validate env khi server start:
 * - PORT: z.number().default(5000)
 * - MONGODB_URI: z.string().url()
 * - JWT_SECRET: z.string().min(32)
 * - JWT_EXPIRES_IN: z.string().default('7d')
 * - CORS_ORIGIN: z.string()
 * 
 * Nếu thiếu env → throw error rõ ràng khi start (không crash runtime)
 */
