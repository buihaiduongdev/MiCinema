import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../../lib/api-client';

/**
 * Hook để lấy dashboard overview statistics
 * GET /api/statistics/overview
 */
export const useDashboardOverview = () => {
    return useQuery({
        queryKey: ['statistics', 'overview'],
        queryFn: async () => {
            const response = await apiClient.get('/statistics/overview');
            return response.data;
        },
    });
};

/**
 * Hook để lấy revenue trends theo ngày/tuần/tháng
 * GET /api/statistics/revenue
 */
export const useRevenueStats = (
    groupBy: 'day' | 'week' | 'month' = 'day',
    startDate?: Date,
    endDate?: Date,
) => {
    return useQuery({
        queryKey: ['statistics', 'revenue', groupBy, startDate, endDate],
        queryFn: async () => {
            const params = new URLSearchParams();
            params.append('groupBy', groupBy);
            if (startDate) params.append('startDate', startDate.toISOString());
            if (endDate) params.append('endDate', endDate.toISOString());

            const response = await apiClient.get(`/statistics/revenue?${params}`);
            return response.data;
        },
    });
};

/**
 * Hook để lấy occupancy rate by room
 * GET /api/statistics/occupancy/by-room
 */
export const useOccupancyByRoom = () => {
    return useQuery({
        queryKey: ['statistics', 'occupancy', 'by-room'],
        queryFn: async () => {
            const response = await apiClient.get('/statistics/occupancy/by-room');
            return response.data;
        },
    });
};

/**
 * Hook để lấy booking statistics
 * GET /api/statistics/bookings
 */
export const useBookingStats = (startDate?: Date, endDate?: Date) => {
    return useQuery({
        queryKey: ['statistics', 'bookings', startDate, endDate],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (startDate) params.append('startDate', startDate.toISOString());
            if (endDate) params.append('endDate', endDate.toISOString());

            const response = await apiClient.get(`/statistics/bookings?${params}`);
            return response.data;
        },
    });
};

/**
 * Hook để lấy movie performance statistics
 * GET /api/statistics/movies
 */
export const useMoviePerformance = (limit: number = 10) => {
    return useQuery({
        queryKey: ['statistics', 'movies', limit],
        queryFn: async () => {
            const response = await apiClient.get(`/statistics/movies?limit=${limit}`);
            return response.data;
        },
    });
};

/**
 * Hook để lấy top movies by revenue
 * GET /api/statistics/top-movies
 */
export const useTopMoviesByRevenue = (limit: number = 5) => {
    return useQuery({
        queryKey: ['statistics', 'top-movies', limit],
        queryFn: async () => {
            const response = await apiClient.get(
                `/statistics/top-movies?limit=${limit}`,
            );
            return response.data;
        },
    });
};

/**
 * Hook để lấy danh sách suất chiếu gần đây
 * GET /api/showtimes
 */
export const useRecentShowtimes = (limit: number = 10) => {
    return useQuery({
        queryKey: ['showtimes', 'recent', limit],
        queryFn: async () => {
            const response = await apiClient.get(
                `/showtimes?limit=${limit}&sort=-startTime`,
            );
            return response.data;
        },
    });
};

/**
 * Hook để lấy danh sách booking gần đây
 * GET /api/bookings/my-bookings (hoặc tạo endpoint mới để admin lấy all bookings)
 */
export const useRecentBookings = (limit: number = 3, page: number = 1) => {
    return useQuery({
        queryKey: ['bookings', 'recent', limit, page],
        queryFn: async () => {
            const response = await apiClient.get(
                `/bookings/my-bookings?limit=${limit}&page=${page}`,
            );
            return response.data;
        },
    });
};
