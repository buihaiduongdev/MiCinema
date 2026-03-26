import { Request, Response, NextFunction } from 'express';

type ParseAsyncSchema = {
  parseAsync: (data: unknown) => Promise<any>;
};

interface ValidationSchema {
  body?: ParseAsyncSchema;
  query?: ParseAsyncSchema;
  params?: ParseAsyncSchema;
}

type SchemaLike = ParseAsyncSchema;

/**
 * Express 5: req.query & req.params là read-only getter
 * → Không gán lại được → phải merge vào object gốc
 */
const mergeInto = (
  target: Record<string, unknown>,
  source: unknown,
) => {
  if (typeof source !== 'object' || source === null) return;

  Object.keys(target).forEach((k) => delete target[k]);
  Object.assign(target, source);
};

export const validate = (schema: SchemaLike | ValidationSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // schema đơn → validate body
      if (
        'parseAsync' in schema &&
        typeof schema.parseAsync === 'function' &&
        !('body' in schema) &&
        !('query' in schema) &&
        !('params' in schema)
      ) {
        req.body = await schema.parseAsync(req.body);
      } else {
        // schema object
        const s = schema as ValidationSchema;

        if (s.body) {
          req.body = await s.body.parseAsync(req.body);
        }

        if (s.query) {
          const parsed = await s.query.parseAsync(req.query);
          mergeInto(
            req.query as unknown as Record<string, unknown>,
            parsed,
          );
        }

        if (s.params) {
          const parsed = await s.params.parseAsync(req.params);
          mergeInto(
            req.params as unknown as Record<string, unknown>,
            parsed,
          );
        }
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
};