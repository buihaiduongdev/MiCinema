import { Request, Response, NextFunction } from 'express';

interface ValidationSchema {
  body?: { parseAsync: (data: any) => Promise<any> };
  query?: { parseAsync: (data: any) => Promise<any> };
  params?: { parseAsync: (data: any) => Promise<any> };
}

type SchemaLike = { parseAsync: (data: any) => Promise<any> };

export const validate = (schema: SchemaLike | ValidationSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (
        'parseAsync' in schema &&
        typeof schema.parseAsync === 'function' &&
        !('body' in schema) &&
        !('query' in schema) &&
        !('params' in schema)
      ) {
        // Schema đơn (Zod schema trực tiếp) → validate body
        req.body = await (schema as SchemaLike).parseAsync(req.body);
      } else {
        // Schema phức tạp { body?, query?, params? }
        const s = schema as ValidationSchema;
        if (s.body) req.body = await s.body.parseAsync(req.body);
        if (s.query) req.query = await s.query.parseAsync(req.query);
        if (s.params) req.params = await s.params.parseAsync(req.params);
      }
      return next();
    } catch (error) {
      return next(error);
    }
  };
};
