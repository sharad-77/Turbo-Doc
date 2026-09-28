import { ZodError } from 'zod';
import { ServerResponse } from 'http';
import { ExtendedRequest, NextFunctionInterface } from '../interfaces/index.js';
import { HttpStatus } from '../constants/index.js';
import { sendErrorResponse } from '../utils/index.js';
import { logger } from './logger.js';
import { env } from '../config/env.js';

/**
 * Handle Zod validation errors
 * @export
 * @param {unknown} error
 * @param {ExtendedRequest} req
 * @param {ServerResponse} res
 * @param {NextFunctionInterface} next
 * @returns
 */
export function ZodErrorHandler(
  error: unknown,
  req: ExtendedRequest,
  res: ServerResponse,
  next: NextFunctionInterface
) {
  if (!(error instanceof ZodError)) {
    next(error);
    return;
  }

  const issues = error.issues.map(issue => ({
    field: issue.path.join('.'),
    message: issue.message,
    code: issue.code,
  }));

  const errorBody: { message: string; data?: unknown; stack?: string } = {
    message: 'Validation failed',
    data: issues,
  };

  if (env.NODE_ENV === 'development') {
    errorBody.stack = error.stack;
  }

  logger.warn(
    {
      err: error,
      issues,
      method: req.method,
      url: req.url,
      reqId: req.id,
    },
    '[ZodValidationError] Request validation failed'
  );

  return sendErrorResponse(res, errorBody, HttpStatus.BAD_REQUEST);
}
