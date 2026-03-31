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

export const updateMe = async (req: Request, res: Response) => {
  const userId = req.user?._id?.toString();

  if (!userId) {
    throw new Error('Không tìm thấy thông tin người dùng');
  }

  const user = await authService.updateMe(userId, req.body);
  res.status(200).json(responseSuccess(user, 'Cập nhật thông tin thành công'));
};
