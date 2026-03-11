import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '@shared/schemas/api.type.js';

/**
 * Global Error Handler Middleware
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  console.error('[Global Error Handler]:', err.stack || err.message);

  const status = err.status || err.statusCode || 500;

  const responseBody: ApiResponse<null> = {
    success: false,
    data: null,
    message: err.message || 'Lỗi hệ thống không xác định',
  };

  if (err.errors) {
    responseBody.error = Object.values(err.errors).map((e: any) => ({
      field: e.path || 'unknown',
      message: e.message,
    }));
  }

  res.status(status).json(responseBody);
};
