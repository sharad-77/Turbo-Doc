import { ServerResponse } from 'http';
import { ExtendedRequest, NextFunctionInterface } from '../interfaces/index.js';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '../exceptions/index.js';
import { env } from '../config/env.js';
import { logger } from './logger.js';

export interface PostgresError extends Error {
  code: string;
  detail?: string;
  table?: string;
  column?: string;
  constraint?: string;
  hint?: string;
  schema?: string;
  position?: string;
}

export const isPostgresError = (err: unknown): err is PostgresError => {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    typeof (err as { code: unknown }).code === 'string'
  );
};

/**
 * Builds a structured error payload containing both the human-readable text
 * and the underlying DB error message + details for local development/debugging.
 */
const buildDbErrorPayload = (textMessage: string, err: PostgresError) => {
  const isDev = env.NODE_ENV !== 'production';

  const details = {
    code: err.code,
    detail: err.detail ?? null,
    table: err.table ?? null,
    column: err.column ?? null,
    constraint: err.constraint ?? null,
    hint: err.hint ?? null,
    schema: err.schema ?? null,
    databaseError: err.message,
  };

  // In local development, show both human text and the database error message / detail
  const message = isDev
    ? `${textMessage}: ${err.message}${err.detail ? ` (${err.detail})` : ''}`
    : textMessage;

  return {
    message,
    error: err.message,
    data: isDev ? details : err.detail ? { detail: err.detail } : null,
    ...(isDev && err.stack ? { stack: err.stack } : {}),
  };
};

/**
 * Middleware that intercepts PostgreSQL errors and translates them to standard HttpException instances
 * @export
 * @param {unknown} err
 * @param {ExtendedRequest} req
 * @param {ServerResponse} res
 * @param {NextFunctionInterface} next
 */
export function PostgresErrorHandler(
  err: unknown,
  req: ExtendedRequest,
  res: ServerResponse,
  next: NextFunctionInterface
) {
  if (!isPostgresError(err)) {
    next(err);
    return;
  }

  logger.error(
    {
      err,
      dbCode: err.code,
      detail: err.detail,
      table: err.table,
      column: err.column,
      constraint: err.constraint,
      method: req.method,
      url: req.url,
      reqId: req.id,
    },
    `[DatabaseError] PostgreSQL error [${err.code}]: ${err.message}`
  );

  // 1. Unique constraint violation (duplicate key)
  if (err.code === '23505') {
    next(
      new ConflictException(
        buildDbErrorPayload('A record with this information already exists', err)
      )
    );
    return;
  }

  // 2. Foreign key violation
  if (err.code === '23503') {
    next(new BadRequestException(buildDbErrorPayload('Referenced record does not exist', err)));
    return;
  }

  // 3. Not null violation
  if (err.code === '23502') {
    const fieldMsg = err.column
      ? `Required field "${err.column}" is missing`
      : 'A required field is missing';
    next(new BadRequestException(buildDbErrorPayload(fieldMsg, err)));
    return;
  }

  // 4. Check constraint violation
  if (err.code === '23514') {
    next(
      new BadRequestException(
        buildDbErrorPayload('Check constraint failed with invalid value', err)
      )
    );
    return;
  }

  // 5. Invalid data format or type syntax (e.g. invalid UUID, invalid integer syntax)
  if (err.code === '22P02') {
    next(
      new BadRequestException(
        buildDbErrorPayload('Invalid data format or type syntax provided', err)
      )
    );
    return;
  }

  // 6. Fallback for other database errors (syntax, connection, schema drift, etc.)
  next(
    new InternalServerErrorException(
      buildDbErrorPayload('A database error occurred during request processing', err)
    )
  );
}
