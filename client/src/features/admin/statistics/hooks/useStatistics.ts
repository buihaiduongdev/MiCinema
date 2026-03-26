/**
 * useStatistics — Lấy dữ liệu thống kê
 *
 * Dùng: nhiều useQuery riêng biệt cho từng loại stats
 * queryKeys: ['stats-revenue'], ['stats-occupancy'], ['stats-overview']
 * refetchInterval: 30 * 1000 (30 giây cho real-time)
 */

import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../../lib/api-client';
import type { ApiResponse } from '@shared/types/api.type';

interface DashboardOverviewStats {
  totalRevenue: number;
  totalTicketsSold: number;
  totalMovies: number;
  totalShowtimes: number;
}

interface RevenueData {
  date: string;
  revenue: number;
}

interface OccupancyData {
  roomId: string;
  roomName: string;
  occupancyRate: number;
  seatsBooked: number;
  totalSeats: number;
}

interface MoviePerformance {
  movieId: string;
  movieTitle: string;
  revenue: number;
  viewCount: number;
  rank: number;
}

/**
 * Hook: Lấy tổng quan dashboard (UC-33)
 */
export const useDashboardOverview = () => {
  return useQuery({
    queryKey: ['statistics', 'overview'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<DashboardOverviewStats>>(
        '/statistics/overview',
      );
      return response.data;
    },
    refetchInterval: 30 * 1000, // Refresh mỗi 30 giây
  });
};

/**
 * Hook: Lấy thống kê doanh thu (UC-34)
 */
export const useRevenueStatistics = (
  startDate?: Date,
  endDate?: Date,
  groupBy: 'day' | 'week' | 'month' = 'day',
) => {
  return useQuery({
    queryKey: ['statistics', 'revenue', { startDate, endDate, groupBy }],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<RevenueData[]>>(
        '/statistics/revenue',
        {
          params: {
            startDate: startDate?.toISOString(),
            endDate: endDate?.toISOString(),
            groupBy,
          },
        },
      );
      return response.data;
    },
  });
};

/**
 * Hook: Lấy tỷ lệ lấp đầy theo phòng (UC-35)
 */
export const useOccupancyByRoom = () => {
  return useQuery({
    queryKey: ['statistics', 'occupancy', 'by-room'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<OccupancyData[]>>(
        '/statistics/occupancy/by-room',
      );
      return response.data;
    },
  });
};

/**
 * Hook: Lấy tỷ lệ lấp đầy theo suất chiếu (UC-35)
 */
export const useOccupancyByShowtime = (
  showtimeId?: string,
  roomId?: string,
) => {
  return useQuery({
    queryKey: ['statistics', 'occupancy', { showtimeId, roomId }],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<OccupancyData[]>>(
        '/statistics/occupancy',
        {
          params: { showtimeId, roomId },
        },
      );
      return response.data;
    },
  });
};

/**
 * Hook: Top phim theo doanh thu (UC-36)
 */
export const useTopMoviesByRevenue = (limit: number = 10) => {
  return useQuery({
    queryKey: ['statistics', 'top-movies', limit],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<MoviePerformance[]>>(
        '/statistics/top-movies',
        {
          params: { limit },
        },
      );
      return response.data;
    },
  });
};

/**
 * Hook: Thống kê chi tiết phim (UC-36)
 */
export const useMovieDetailedStats = (limit: number = 10) => {
  return useQuery({
    queryKey: ['statistics', 'movies', 'detailed', limit],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<MoviePerformance[]>>(
        '/statistics/movies/detailed',
        {
          params: { limit },
        },
      );
      return response.data;
    },
  });
};
