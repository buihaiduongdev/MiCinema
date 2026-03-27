/**
 * Loyalty Service — Business logic
 *
 * Dùng: Mongoose models từ models/
 * Tách business logic ra khỏi controller
 * Export các function: create, getAll, getById, update, delete
 * Xử lý: pagination (utils/pagination), error throwing
 */

import { LoyaltyHistory } from '../../models/LoyaltyHistory.model.js';
import { User } from '../../models/User.model.js';
import { getSkip, getPaginationData } from '../../utils/pagination.js';
import { LOYALTY_ACTION } from '@shared/constants/statuses.js';

type CreateLoyaltyInput = {
  userId: string;
  points: number;
  action: (typeof LOYALTY_ACTION)[keyof typeof LOYALTY_ACTION];
  description: string;
  bookingId?: string;
};

type GetAllOptions = {
  page?: number;
  limit?: number;
  userId?: string;
  action?: string;
};

export const create = async (data: CreateLoyaltyInput) => {
  const user = await User.findById(data.userId);
  if (!user) throw new Error('Người dùng không tồn tại');

  const loyaltyRecord = await LoyaltyHistory.create({
    userId: data.userId,
    points: data.points,
    action: data.action,
    description: data.description,
    ...(data.bookingId && { bookingId: data.bookingId }),
  });

  user.loyaltyPoints = Math.max(0, user.loyaltyPoints + data.points);
  await user.save();

  return loyaltyRecord.populate('userId bookingId');
};

export const getAll = async (opts: GetAllOptions = {}) => {
  const page = Math.max(1, Number(opts.page) || 1);
  const limit = Math.max(1, Number(opts.limit) || 10);

  const filter: any = {};
  if (opts.userId) filter.userId = opts.userId;
  if (opts.action) filter.action = opts.action;

  const totalItems = await LoyaltyHistory.countDocuments(filter);
  const skip = getSkip(page, limit);
  const data = await LoyaltyHistory.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('userId bookingId');

  const pagination = getPaginationData(totalItems, page, limit);

  return { data, pagination };
};

export const getById = async (id: string) => {
  const record = await LoyaltyHistory.findById(id).populate('userId bookingId');
  if (!record) throw new Error('Bản ghi lịch sử không tồn tại');
  return record;
};

export const getByUserId = async (userId: string, opts: GetAllOptions = {}) => {
  const page = Math.max(1, Number(opts.page) || 1);
  const limit = Math.max(1, Number(opts.limit) || 10);

  const user = await User.findById(userId);
  if (!user) throw new Error('Người dùng không tồn tại');

  const filter: any = { userId };
  if (opts.action) filter.action = opts.action;

  const totalItems = await LoyaltyHistory.countDocuments(filter);
  const skip = getSkip(page, limit);
  const data = await LoyaltyHistory.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('bookingId');

  const pagination = getPaginationData(totalItems, page, limit);

  return { data, pagination };
};

export const update = async (
  id: string,
  payload: Partial<CreateLoyaltyInput>,
) => {
  const record = await LoyaltyHistory.findById(id);
  if (!record) throw new Error('Bản ghi lịch sử không tồn tại');

  if (payload.points !== undefined && payload.points !== record.points) {
    const pointsDifference = payload.points - record.points;
    const user = await User.findById(record.userId);
    if (user) {
      user.loyaltyPoints = Math.max(0, user.loyaltyPoints + pointsDifference);
      await user.save();
    }
  }

  const updated = await LoyaltyHistory.findByIdAndUpdate(id, payload, {
    new: true,
  }).populate('userId bookingId');

  if (!updated) throw new Error('Cập nhật thất bại');
  return updated;
};

export const remove = async (id: string) => {
  const record = await LoyaltyHistory.findById(id);
  if (!record) throw new Error('Bản ghi lịch sử không tồn tại');

  const user = await User.findById(record.userId);
  if (user) {
    user.loyaltyPoints = Math.max(0, user.loyaltyPoints - record.points);
    await user.save();
  }

  const deleted = await LoyaltyHistory.findByIdAndDelete(id);
  return deleted;
};

export const expirePoints = async (userId: string, expiryPoints: number) => {
  if (expiryPoints <= 0) throw new Error('Số điểm phải lớn hơn 0');

  const user = await User.findById(userId);
  if (!user) throw new Error('Người dùng không tồn tại');

  const expireRecord = await LoyaltyHistory.create({
    userId,
    points: -expiryPoints,
    action: LOYALTY_ACTION.EXPIRE,
    description: `${expiryPoints} điểm đã hết hạn`,
  });

  user.loyaltyPoints = Math.max(0, user.loyaltyPoints - expiryPoints);
  await user.save();

  return expireRecord.populate('userId');
};

export const getMemberRankingByPoints = async (limit = 10) => {
  const ranking = await User.find({ isActive: true })
    .select('_id fullName email loyaltyPoints membershipTier avatar')
    .sort({ loyaltyPoints: -1 })
    .limit(limit)
    .lean();

  return ranking.map((user, index) => ({
    rank: index + 1,
    userId: user._id,
    fullName: user.fullName,
    email: user.email,
    loyaltyPoints: user.loyaltyPoints,
    membershipTier: user.membershipTier,
    avatar: user.avatar,
  }));
};

/**
 * Get member ranking by membership tier
 * Xem bảng xếp hạng thành viên - Top khách hàng theo hạng
 */
export const getMemberRankingByTier = async (limit = 100) => {
  const users = await User.find({ isActive: true })
    .select('_id fullName email loyaltyPoints membershipTier avatar')
    .lean();

  const tierPriority: Record<string, number> = {
    GOLD: 3,
    SILVER: 2,
    BRONZE: 1,
  };
  const ranking = users
    .sort((a: any, b: any) => {
      const tierDiff =
        (tierPriority[b.membershipTier] || 0) -
        (tierPriority[a.membershipTier] || 0);
      if (tierDiff !== 0) return tierDiff;
      return (b.loyaltyPoints || 0) - (a.loyaltyPoints || 0);
    })
    .slice(0, limit);

  return ranking.map((user: any, index) => ({
    rank: index + 1,
    userId: user._id,
    fullName: user.fullName,
    email: user.email,
    loyaltyPoints: user.loyaltyPoints,
    membershipTier: user.membershipTier,
    avatar: user.avatar,
  }));
};

export const getMemberRankingDetailed = async (
  limit = 10,
  sortBy: 'points' | 'tier' = 'points',
) => {
  const sortOption: any =
    sortBy === 'points'
      ? { loyaltyPoints: -1 }
      : {
          membershipTier: -1,
          loyaltyPoints: -1,
        };

  const ranking = await User.find({ isActive: true })
    .select('_id fullName email loyaltyPoints membershipTier avatar createdAt')
    .sort(sortOption)
    .limit(limit)
    .lean();

  return ranking.map((user: any, index) => ({
    rank: index + 1,
    userId: user._id,
    fullName: user.fullName,
    email: user.email,
    loyaltyPoints: user.loyaltyPoints,
    membershipTier: user.membershipTier,
    avatar: user.avatar,
    memberSince: user.createdAt,
  }));
};
