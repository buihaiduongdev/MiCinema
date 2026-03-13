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
import { signToken, TokenPayLoad } from 'src/utils/jwt.js';
import { responseSuccess } from 'src/utils/response.js';
import { AuthResponseData } from '@shared/schemas/auth.schema.js';

export const register = async (req: Request, res: Response) => {
  const user = await authService.register(req.body);

  const token = signToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  const responseData: AuthResponseData = { user, token };

  res.status(201).json(responseSuccess(responseData, 'Đăng ký thành công'));
};

export const login = async (req: Request, res: Response) => {
  const user = await authService.login(req.body);
  const tokenPayLoad: TokenPayLoad = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };
  const token = signToken(tokenPayLoad);
  const responseData: AuthResponseData = { user, token };
  res.status(200).json(responseSuccess(responseData, 'Đăng nhập thành công'));
};
