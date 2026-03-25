import z from 'zod';
import { User, userSchema } from './user.schema.js';
export const registerSchema = userSchema.pick({
  email: true,
  password: true,
  fullName: true,
  phone: true,
});

export const loginSchema = userSchema.pick({
  email: true,
  password: true,
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type AuthResponseData = {
  user: User;
  token: string;
};
