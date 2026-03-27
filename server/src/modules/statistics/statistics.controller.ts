/**
 * Statistics Controller — Thống kê doanh thu, tỷ lệ lấp đầy, dashboard
 *
 * Dùng: import schemas từ @shared/schemas/statistics.schema
 * Validate: schema.safeParse(req.body) hoặc dùng validate.middleware
 * Response: dùng utils/response.ts helper
 * Auth: req.user từ auth.middleware
 */

import { Request, Response } from 'express';
import * as statisticsService from './statistics.service.js';
import { responseSuccess } from '../../utils/response.js';

/**
 * Get dashboard overview — tổng quan các chỉ số chính
 * GET /api/statistics/overview
 */
export const getOverview = async (req: Request, res: Response) => {
  const data = await statisticsService.getOverview();
  res
    .status(200)
    .json(responseSuccess(data, 'Lấy tổng quan dashboard thành công'));
};

/**
 * Get revenue statistics
 * GET /api/statistics/revenue?startDate=...&endDate=...&groupBy=day|week|month
 */
export const getRevenue = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, groupBy } = req.query;
    const opts = {
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
      groupBy: (['day', 'week', 'month'].includes(groupBy as string)
        ? (groupBy as 'day' | 'week' | 'month')
        : 'day') as 'day' | 'week' | 'month',
    };
    const data = await statisticsService.getRevenue(opts);
    res
      .status(200)
      .json(responseSuccess(data, 'Lấy dữ liệu doanh thu thành công'));
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: (error as any).message });
  }
};

/**
 * Get occupancy rate statistics
 * GET /api/statistics/occupancy?showtimeId=...&roomId=...
 */
export const getOccupancy = async (req: Request, res: Response) => {
  const { showtimeId, roomId } = req.query;
  const opts = {
    showtimeId: showtimeId as string | undefined,
    roomId: roomId as string | undefined,
  };
  const data = await statisticsService.getOccupancy(opts);
  res
    .status(200)
    .json(
      responseSuccess(data, 'Lấy tỷ lệ lấp đầy theo suất chiếu thành công'),
    );
};

/**
 * Get occupancy rate by room
 * GET /api/statistics/occupancy/by-room
 */
export const getOccupancyByRoom = async (req: Request, res: Response) => {
  const data = await statisticsService.getOccupancyByRoom();
  res
    .status(200)
    .json(responseSuccess(data, 'Lấy tỷ lệ lấp đầy theo phòng thành công'));
};

/**
 * Get booking statistics by status
 * GET /api/statistics/bookings?startDate=...&endDate=...
 */
export const getBookingStats = async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;
  const opts = {
    startDate: startDate ? new Date(startDate as string) : undefined,
    endDate: endDate ? new Date(endDate as string) : undefined,
  };
  const data = await statisticsService.getBookingStats(opts);
  res.status(200).json(responseSuccess(data, 'Lấy thống kê đặt vé thành công'));
};

/**
 * Get movie performance statistics
 * GET /api/statistics/movies?limit=10
 */
export const getMoviePerformance = async (req: Request, res: Response) => {
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  const data = await statisticsService.getMoviePerformance(limit);
  res
    .status(200)
    .json(responseSuccess(data, 'Lấy top phim theo doanh thu thành công'));
};

/**
 * Get top movies by revenue
 * GET /api/statistics/top-movies?limit=10
 */
export const getTopMoviesByRevenue = async (req: Request, res: Response) => {
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  const data = await statisticsService.getTopMoviesByRevenue(limit);
  res
    .status(200)
    .json(responseSuccess(data, 'Lấy top phim theo doanh thu thành công'));
};

/**
 * Get movies with detailed statistics
 * GET /api/statistics/movies/detailed?limit=10
 */
export const getMovieDetailedStats = async (req: Request, res: Response) => {
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  const data = await statisticsService.getMovieDetailedStats(limit);
  res
    .status(200)
    .json(responseSuccess(data, 'Lấy thống kê chi tiết phim thành công'));
};

/**
 * Get user growth statistics
 * GET /api/statistics/users?startDate=...&endDate=...&groupBy=day|week|month
 */
export const getUserGrowth = async (req: Request, res: Response) => {
  const { startDate, endDate, groupBy } = req.query;
  const opts = {
    startDate: startDate ? new Date(startDate as string) : undefined,
    endDate: endDate ? new Date(endDate as string) : undefined,
    groupBy: (['day', 'week', 'month'].includes(groupBy as string)
      ? (groupBy as 'day' | 'week' | 'month')
      : 'day') as 'day' | 'week' | 'month',
  };
  const data = await statisticsService.getUserGrowth(opts);
  res
    .status(200)
    .json(
      responseSuccess(data, 'Lấy thống kê tăng trưởng người dùng thành công'),
    );
};

