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

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const replaceObjectContent = (
  target: Record<string, unknown>,
  nextValue: unknown,
) => {
  if (!isPlainObject(nextValue)) return;

  Object.keys(target).forEach((key) => {
    delete target[key];
  });

  Object.assign(target, nextValue);
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
        req.body = await schema.parseAsync(req.body);
      } else {
        const s = schema as ValidationSchema;

        if (s.body) {
          req.body = await s.body.parseAsync(req.body);
        }

        if (s.query) {
          const parsedQuery = await s.query.parseAsync(req.query);
          replaceObjectContent(
            req.query as unknown as Record<string, unknown>,
            parsedQuery,
          );
        }

        if (s.params) {
          const parsedParams = await s.params.parseAsync(req.params);
          replaceObjectContent(
            req.params as unknown as Record<string, unknown>,
            parsedParams,
          );
        }
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
};
