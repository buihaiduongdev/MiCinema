/**
 * Loyalty Service — API calls cho module tích điểm
 *
 * Dùng: apiClient (đã auto attach token)
 */

import apiClient from '../../../lib/api-client';

export interface LoyaltySummary {
  user: {
    _id: string;
    fullName: string;
    email: string;
    avatar?: string;
  };
  loyaltyPoints: number;
  membershipTier: string;
  nextTier: string | null;
  pointsToNextTier: number;
  progressPercent: number;
  totalEarned: number;
  totalRedeemed: number;
  tierThresholds: Record<string, number>;
}

export interface LoyaltyHistoryItem {
  _id: string;
  userId: string;
  points: number;
  action: 'EARN' | 'REDEEM' | 'EXPIRE';
  description: string;
  bookingId?: {
    _id: string;
  };
  createdAt: string;
  updatedAt: string;
}

// --- LOYALTY API ---

/** Lấy tóm tắt loyalty (điểm, hạng, tiến trình) */
export const getMySummary = () => apiClient.get('/loyalty/me');

/** Lấy lịch sử tích/dùng điểm */
export const getMyHistory = (params?: Record<string, any>) =>
  apiClient.get('/loyalty/me/history', { params });

/** Lấy bảng xếp hạng thành viên */
export const getMemberRanking = (params?: Record<string, any>) =>
  apiClient.get('/loyalty/ranking', { params });
