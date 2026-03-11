import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000'),
  MONGODB_URI: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JWR_EXPIRES_IN: z.string().default('7d'),
  CORS_ORIGIN: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('Invalid env vars', _env.error.format());
  process.exit(1);
}

export const env = _env.data;
