import { ZodSchema } from 'zod';
import { ServerResponse } from 'http';
import { ExtendedRequest, NextFunctionInterface } from '../interfaces/index.js';

/**
 * Bind Zod schema with validator middleware to validate request object
 * @export
 * @param {ZodSchema} schema
 * @returns Middleware function
 */
export function zodValidatorMiddleware(schema: ZodSchema) {
  return async (req: ExtendedRequest, _res: ServerResponse, next: NextFunctionInterface) => {
    try {
      const parsed = (await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      })) as { body?: unknown; query?: unknown; params?: unknown };

      if (parsed.body !== undefined) {
        req.body = parsed.body;
      }
      if (parsed.query !== undefined) {
        req.query = Object.assign(req.query || {}, parsed.query);
      }
      if (parsed.params !== undefined) {
        req.params = parsed.params as typeof req.params;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
