/**
 * Auth Controller — Xác thực (đăng nhập, đăng ký, JWT)
 *
 * Dùng: import schemas từ @shared/schemas/auth.schema
 * Validate: schema.safeParse(req.body) hoặc dùng validate.middleware
 * Response: dùng utils/response.ts helper
 * Auth: req.user từ auth.middleware
 */

import { Request, Response } from 'express';
import * as authService from './auth.service.js';

export const register = async (req: Request, res: Response) => {
  const user = await authService.register(req.body);

  res.status(201).json({
    success: true,
    message: 'Đăng ký thành công',
    data: user,
  });
};

export const login = async (req: Request, res: Response) => {
  const user = await authService.login(req.body);

  // thêm JWT Token ở đây
  res.status(200).json({
    success: true,
    message: 'Đăng nhập thành công',
    data: user,
  });
};
