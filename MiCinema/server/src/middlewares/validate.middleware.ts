import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';

interface ValidationSchema {
  body?: AnyZodObject;
  query?: AnyZodObject;
  params?: AnyZodObject;
}

export const validate = (schema: AnyZodObject | ValidationSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if ('parseAsync' in schema) {
        req.body = await schema.parseAsync(req.body);
      } else {
        if (schema.body) req.body = await schema.body.parseAsync(req.body);
        if (schema.query) req.query = await schema.query.parseAsync(req.query);
        if (schema.params)
          req.params = await schema.params.parseAsync(req.params);
      }
      return next();
    } catch (error) {
      return next(error);
    }
  };
};
