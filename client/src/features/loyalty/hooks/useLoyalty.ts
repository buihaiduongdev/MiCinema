/**
 * useLoyalty — Hooks cho tích điểm thành viên
 *
 * Dùng: useQuery từ TanStack Query
 * Bao gồm: useLoyaltySummary, useLoyaltyHistory, useMemberRanking
 */

import { useQuery } from '@tanstack/react-query';
import {
  getMySummary,
  getMyHistory,
  getMemberRanking,
} from '../services/loyalty.service';

/**
 * Lấy tóm tắt loyalty (điểm, hạng, tiến trình lên hạng)
 */
export const useLoyaltySummary = (enabled = true) =>
  useQuery({
    queryKey: ['loyalty', 'summary'],
    queryFn: getMySummary,
    staleTime: 2 * 60 * 1000,
    enabled,
  });

/**
 * Lấy lịch sử tích/dùng điểm (có phân trang)
 */
export const useLoyaltyHistory = (
  params?: Record<string, any>,
  enabled = true,
) =>
  useQuery({
    queryKey: ['loyalty', 'history', params],
    queryFn: () => getMyHistory(params),
    staleTime: 2 * 60 * 1000,
    enabled,
  });

/**
 * Lấy bảng xếp hạng thành viên
 */
export const useMemberRanking = (
  params?: Record<string, any>,
  enabled = true,
) =>
  useQuery({
    queryKey: ['loyalty', 'ranking', params],
    queryFn: () => getMemberRanking(params),
    staleTime: 5 * 60 * 1000,
    enabled,
  });
