/**
 * Auth Service — Business logic
 *
 * Dùng: Mongoose models từ models/
 * Tách business logic ra khỏi controller
 * Export các function: create, getAll, getById, update, delete
 * Xử lý: pagination (utils/pagination), error throwing
 */

import { User } from '../../models/User.model.js';
import { RegisterInput, LoginInput } from '@shared/schemas/auth.schema.js';

function httpError(message: string, status: number) {
  const err = new Error(message) as Error & { status: number };
  err.status = status;
  return err;
}

export const login = async (data: LoginInput) => {
  const user = await User.findOne({ email: data.email }).select('+password');
  if (!user) {
    throw httpError('Email không tồn tại', 401);
  }

  const isMatch = await user.comparePassword(data.password);
  if (!isMatch) {
    throw httpError('Mật khẩu không đúng', 401);
  }

  return user;
};

export const register = async (data: RegisterInput) => {
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    throw httpError('Email này đã được sử  dụng', 409);
  }

  const user = await User.create(data);
  return user;
};
