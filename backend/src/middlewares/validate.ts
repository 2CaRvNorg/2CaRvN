import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

/**
 * Zod Validation proxy Factory (Zod v4 compatible)
 * Validates req.body against a Zod schema.
 * Strips unknown fields (strip mode is default in Zod).
 *
 * Usage: router.post('/route', validate(mySchema), controller)
 */
export const validate =
  (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const formatted = result.error.issues.map((issue) => ({
        field: issue.path.join('.') || 'body',
        message: issue.message,
      }));

      next({
        name: 'ZodError',
        statusCode: 422,
        errors: formatted,
        message: 'Validation failed',
      });
      return;
    }

    // Replace req.body with the parsed (and sanitized) data
    req.body = result.data;
    next();
  };

/**
 * Validates req.params against a Zod schema.
 */
export const validateParams =
  (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      next({
        name: 'ZodError',
        statusCode: 422,
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join('.') || 'params',
          message: issue.message,
        })),
        message: 'Invalid URL parameters',
      });
      return;
    }

    req.params = result.data as Record<string, string>;
    next();
  };

/**
 * Validates req.query against a Zod schema.
 */
export const validateQuery =
  (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      next({
        name: 'ZodError',
        statusCode: 422,
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join('.') || 'query',
          message: issue.message,
        })),
        message: 'Invalid query parameters',
      });
      return;
    }

    req.query = result.data as Record<string, string>;
    next();
  };
