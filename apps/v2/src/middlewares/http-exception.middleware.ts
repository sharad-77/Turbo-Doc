import { ExtendedRequest, NextFunctionInterface } from '../interfaces/index.js';
import { ServerResponse } from 'http';
import { HttpException } from '../exceptions/index.js';
import { sendErrorResponse } from '../utils/index.js';
import { env } from '../config/env.js';
import { logger } from './logger.js';

/**
 * Handle http exceptions
 * @export
 * @param {unknown} error
 * @param {ExtendedRequest} req
 * @param {ServerResponse} res
 * @param {NextFunctionInterface} next
 * @returns
 */
export function HandleHttpException(
  error: unknown,
  req: ExtendedRequest,
  res: ServerResponse,
  next: NextFunctionInterface
) {
  if (!(error instanceof HttpException)) {
    next(error);
    return;
  }
  const payload = error.payload as
    | { message?: string; data?: unknown; error?: string; stack?: string }
    | undefined;
  const message = payload?.message || error.message;

  let errorBody: { data?: unknown; message: string; [key: string]: unknown } = {
    message: typeof message === 'string' ? message : 'Http Exception',
  };

  if (typeof payload === 'object' && payload !== null) {
    errorBody = {
      ...payload,
      message: typeof message === 'string' ? message : 'Http Exception',
    };
  }

  if (env.NODE_ENV === 'development') {
    errorBody = {
      ...errorBody,
      data: errorBody.data !== undefined ? errorBody.data : error.stack,
      stack: errorBody.stack ?? error.stack,
    };
  }

  logger.error(
    {
      err: error,
      method: req.method,
      url: req.url,
      reqId: req.id,
    },
    `[HttpException] ${typeof message === 'object' ? JSON.stringify(message) : message}`
  );

  return sendErrorResponse(res, errorBody, error.getStatus());
}
