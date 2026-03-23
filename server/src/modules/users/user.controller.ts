/**
 * Users Controller — Quản lý tài khoản, profile, khoá/mở khoá
 *
 * Dùng: import schemas từ @shared/schemas/user.schema
 * Validate: schema.safeParse(req.body) hoặc dùng validate.middleware
 * Response: dùng utils/response.ts helper
 * Auth: req.user từ auth.middleware
 */
import { Request, Response } from 'express';
import * as userService from './user.service.js';
import { responseSuccess } from 'src/utils/response.js';

// Create a new user (admin)
export const create = async (req: Request, res: Response) => {
    const user = await userService.create(req.body);
    res.status(201).json(responseSuccess(user, 'Tạo người dùng thành công'));
};

// Get paginated users (admin)
export const getAll = async (req: Request, res: Response) => {
    const { page, limit, search, role, isActive } = req.query as any;
    const opts = {
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        search,
        role,
        isActive: typeof isActive !== 'undefined' ? isActive === 'true' : undefined,
    };

    const result = await userService.getAll(opts);
    res.status(200).json(responseSuccess(result, 'Lấy danh sách người dùng thành công'));
};

// Get user by id
export const getById = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const user = await userService.getById(id);
    res.status(200).json(responseSuccess(user, 'Lấy thông tin người dùng thành công'));
};

// Update user (admin or profile endpoint)
export const update = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const updated = await userService.update(id, req.body);
    res.status(200).json(responseSuccess(updated, 'Cập nhật người dùng thành công'));
};

// Delete user
export const remove = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const deleted = await userService.remove(id);
    res.status(200).json(responseSuccess(deleted, 'Xóa người dùng thành công'));
};

// Lock user account
export const lockUser = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const user = await userService.lockUser(id);
    res.status(200).json(responseSuccess(user, 'Khoá tài khoản thành công'));
};

// Unlock user account
export const unlockUser = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const user = await userService.unlockUser(id);
    res.status(200).json(responseSuccess(user, 'Mở khoá tài khoản thành công'));
};

