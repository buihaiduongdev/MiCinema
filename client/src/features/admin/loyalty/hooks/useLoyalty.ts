/**
 * useLoyalty — Hooks quản lý loyalty points và member ranking
 *
 * Dùng: useQuery cho các endpoint loyalty
 */

import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../../lib/api-client';
import type { ApiResponse } from '@shared/types/api.type';

interface MemberRanking {
  userId: string;
  fullName: string;
  email: string;
  loyaltyPoints: number;
  membershipTier: string;
  rank: number;
}

/**
 * Hook: Lấy bảng xếp hạng thành viên theo điểm (UC-51)
 */
export const useMemberRankingByPoints = (limit: number = 10) => {
  return useQuery({
    queryKey: ['loyalty', 'ranking', 'points', limit],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<MemberRanking[]>>(
        '/loyalty/ranking/points',
        {
          params: { limit },
        },
      );
      return response.data;
    },
  });
};

/**
 * Hook: Lấy bảng xếp hạng thành viên theo hạng (UC-51)
 */
export const useMemberRankingByTier = (limit: number = 100) => {
  return useQuery({
    queryKey: ['loyalty', 'ranking', 'tier', limit],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<MemberRanking[]>>(
        '/loyalty/ranking/tier',
        {
          params: { limit },
        },
      );
      return response.data;
    },
  });
};

/**
 * Hook: Lấy bảng xếp hạng thành viên chi tiết (UC-51)
 */
export const useMemberRankingDetailed = (
  limit: number = 10,
  sortBy: 'points' | 'tier' = 'points',
) => {
  return useQuery({
    queryKey: ['loyalty', 'ranking', 'detailed', limit, sortBy],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<MemberRanking[]>>(
        '/loyalty/ranking',
        {
          params: { limit, sortBy },
        },
      );
      return response.data;
    },
  });
};
