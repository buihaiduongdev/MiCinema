/**
 * Users Service — Business logic
 *
 * Dùng: Mongoose models từ models/
 * Tách business logic ra khỏi controller
 * Export các function: create, getAll, getById, update, delete
 * Xử lý: pagination (utils/pagination), error throwing
 */
import { User } from '../../models/User.model.js';
import { getSkip, getPaginationData } from '../../utils/pagination.js';
import { User as UserType } from '@shared/schemas/user.schema.js';

type GetAllOptions = {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  isActive?: boolean;
};

export const create = async (data: Partial<UserType>) => {
  if (data.email) {
    const existing = await User.findOne({ email: data.email });
    if (existing) throw new Error('Email này đã được sử dụng');
  }

  const user = await User.create(data);
  return user;
};

export const getAll = async (opts: GetAllOptions = {}) => {
  const page = Math.max(1, Number(opts.page) || 1);
  const limit = Math.max(1, Number(opts.limit) || 10);

  const filter: any = {};
  if (opts.search) {
    const s = opts.search.trim();
    const regex = new RegExp(s.replace(/[.*+?^${}()|[\]\\]/g, ''), 'i');
    filter.$or = [{ fullName: regex }, { email: regex }];
  }
  if (opts.role) filter.role = opts.role;
  if (typeof opts.isActive === 'boolean') filter.isActive = opts.isActive;

  const totalItems = await User.countDocuments(filter);
  const skip = getSkip(page, limit);
  const data = await User.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  const pagination = getPaginationData(totalItems, page, limit);

  return { data, pagination };
};

export const getById = async (id: string) => {
  const user = await User.findById(id);
  if (!user) throw new Error('Người dùng không tồn tại');
  return user;
};

export const update = async (id: string, payload: Partial<UserType>) => {
  const user = await User.findById(id);
  if (!user) throw new Error('Người dùng không tồn tại');

  if (payload.email && payload.email !== user.email) {
    const existing = await User.findOne({ email: payload.email });
    if (existing) throw new Error('Email này đã được sử dụng');
  }

  if (payload.password) {
    user.password = payload.password as string;
    const { password, ...rest } = payload;
    Object.assign(user, rest);
    await user.save();
    return user;
  }

  const updated = await User.findByIdAndUpdate(id, payload, { new: true });
  if (!updated) throw new Error('Cập nhật thất bại');
  return updated;
};

export const remove = async (id: string) => {
  const deleted = await User.findByIdAndDelete(id);
  if (!deleted) throw new Error('Người dùng không tồn tại');
  return deleted;
};

export const lockUser = async (id: string) => {
  const user = await User.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true },
  );
  if (!user) throw new Error('Người dùng không tồn tại');
  return user;
};

export const unlockUser = async (id: string) => {
  const user = await User.findByIdAndUpdate(
    id,
    { isActive: true },
    { new: true },
  );
  if (!user) throw new Error('Người dùng không tồn tại');
  return user;
};
