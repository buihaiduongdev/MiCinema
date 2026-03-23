/**
 * Loyalty Controller — Tích điểm, đổi điểm, cấu hình hạng thành viên
 *
 * Dùng: import schemas từ @shared/schemas/loyalty.schema
 * Validate: schema.safeParse(req.body) hoặc dùng validate.middleware
 * Response: dùng utils/response.ts helper
 * Auth: req.user từ auth.middleware
 */

import { Request, Response } from 'express';
import * as loyaltyService from './loyalty.service.js';
import { responseSuccess } from '../../utils/response.js';

/**
 * Get member ranking by loyalty points
 * GET /api/loyalty/ranking/points?limit=10
 * Xem bảng xếp hạng thành viên - Top khách hàng theo điểm
 */
export const getMemberRankingByPoints = async (req: Request, res: Response) => {
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const data = await loyaltyService.getMemberRankingByPoints(limit);
    res
        .status(200)
        .json(responseSuccess(data, 'Lấy bảng xếp hạng thành viên theo điểm thành công'));
};

/**
 * Get member ranking by membership tier
 * GET /api/loyalty/ranking/tier?limit=100
 * Xem bảng xếp hạng thành viên - Top khách hàng theo hạng
 */
export const getMemberRankingByTier = async (req: Request, res: Response) => {
    const limit = req.query.limit ? Number(req.query.limit) : 100;
    const data = await loyaltyService.getMemberRankingByTier(limit);
    res
        .status(200)
        .json(responseSuccess(data, 'Lấy bảng xếp hạng thành viên theo hạng thành công'));
};

/**
 * Get detailed member ranking
 * GET /api/loyalty/ranking?sortBy=points|tier&limit=10
 * Xem bảng xếp hạng thành viên chi tiết
 */
export const getMemberRankingDetailed = async (req: Request, res: Response) => {
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const sortBy = (req.query.sortBy as 'points' | 'tier') || 'points';

    const data = await loyaltyService.getMemberRankingDetailed(limit, sortBy);
    res.status(200).json(responseSuccess(data, 'Lấy bảng xếp hạng thành viên thành công'));
};
