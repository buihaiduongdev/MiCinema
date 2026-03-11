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

export const register = async (data: RegisterInput) => {
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    throw new Error('Email này đã được sử  dụng');
  }

  const user = await User.create(data);
  return user;
};

export const login = async (data: LoginInput) => {
  const user = await User.findOne({ email: data.email }).select('+password');
  if (!user) {
    throw new Error('Email không tồn tại');
  }

  const isMatch = await user.comparePassword(data.password);
  if (!isMatch) {
    throw new Error('Mật khẩu không đúng');
  }

  return user;
};
