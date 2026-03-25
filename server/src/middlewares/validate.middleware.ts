import { Request, Response, NextFunction } from 'express';

interface ValidationSchema {
  body?: { parseAsync: (data: any) => Promise<any> };
  query?: { parseAsync: (data: any) => Promise<any> };
  params?: { parseAsync: (data: any) => Promise<any> };
}

type SchemaLike = { parseAsync: (data: any) => Promise<any> };

/**
 * Express 5: req.query & req.params là read-only getter
 * → Không thể gán lại (req.query = parsed)
 * → Dùng Object.assign để merge parsed data vào object gốc
 */
const mergeInto = (target: Record<string, any>, source: Record<string, any>) => {
  Object.keys(target).forEach((k) => delete target[k]);
  Object.assign(target, source);
};

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
        if (s.query) {
          const parsed = await s.query.parseAsync(req.query);
          mergeInto(req.query as Record<string, any>, parsed);
        }
        if (s.params) {
          const parsed = await s.params.parseAsync(req.params);
          mergeInto(req.params as Record<string, any>, parsed);
        }
      }
      return next();
    } catch (error) {
      return next(error);
    }
  };
};
