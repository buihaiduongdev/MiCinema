import { Request, Response, NextFunction } from 'express';
import { responseError } from 'src/utils/response.js';
import { ZodError } from 'zod';
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error('[Global Error Handler]:', err.stack || err.message);

  const status = err.status || err.statusCode || 500;

  const responseBody = responseError(
    err.message || 'Lỗi hệ thống không xác định',
  );

  if (err instanceof ZodError) {
    const errors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return res.status(400).json(responseError('Dữ liệu không hợp lệ', errors));
  }

  if (err.errors) {
    responseBody.error = Object.values(err.errors).map((e: any) => ({
      field: e.path || 'unknown',
      message: e.message,
    }));
  }

  res.status(status).json(responseBody);
};
