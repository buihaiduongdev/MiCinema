/**
 * Validate Middleware — Zod Schema Generic
 *
 * Dùng: import { ZodSchema } from 'zod'
 *
 * validate(schema: ZodSchema): middleware
 * - schema.safeParse(req.body)
 * - Nếu lỗi → 400 + errors chi tiết
 * - Nếu OK → req.body = result.data (đã clean/transform) → next()
 *
 * VD: router.post('/movies', validate(createMovieSchema), movieController.create)
 */
import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ApiResponse } from '@shared/schemas/api.type.js';

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedData = await schema.parseAsync(req.body);
      req.body = parsedData;

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorResponse: ApiResponse<null> = {
          success: false,
          data: null,
          message: 'Dữ liệu không hợp lệ',
          error: error.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        };
        return res.status(400).json(errorResponse);
      }

      return next(error);
    }
  };
};
