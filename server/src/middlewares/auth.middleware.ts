/**
 * Auth Middleware — JWT Verify + Role Check
 *
 * authMiddleware: (req, res, next)
 * - Lấy token từ header: Authorization: Bearer <token>
 * - jwt.verify(token, JWT_SECRET) → decode payload
 * - Gắn req.user = { _id, email, vaiTro }
 * - 401 nếu không có token hoặc token hết hạn
 *
 * roleGuard(allowedRoles: string[]): middleware factory
 * - Kiểm tra req.user.vaiTro có nằm trong allowedRoles
 * - 403 nếu không có quyền
 */

import { Request, Response, NextFunction } from 'express';
import { verifyToken } from 'src/utils/jwt.js';
import { extractToken } from 'src/utils/token.js';
import { responseError } from 'src/utils/response.js';
import { User } from 'src/models/index.js';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let token = extractToken(req);

  if (!token) {
    return res.status(401).json(responseError('Vui lòng đăng nhập.'));
  }

  try {
    const decoded = verifyToken(token);

    const currentUser = await User.findById(decoded.userId);
    if (!currentUser || !currentUser?.isActive) {
      return res.status(401).json(responseError('Tài khoản không hợp lệ.'));
    }

    req.user = currentUser;
    next();
  } catch (error) {
    return res.status(401).json(responseError('Token không hợp lệ'));
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json(responseError('Bạn không có quyền truy cập'));
    }
    next();
  };
};
