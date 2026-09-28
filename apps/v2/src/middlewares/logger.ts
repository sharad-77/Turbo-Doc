import crypto from 'node:crypto';
import { IncomingMessage, ServerResponse } from 'node:http';
import pino from 'pino';
import { pinoHttp } from 'pino-http';
import { env } from '../config/env.js';

export const logger = pino({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  base: { service: 'turbo-doc-api' },
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'req.headers["x-api-key"]',
      '*.password',
      '*.*password',
      '*.token',
      '*.secret',
      '*.refreshToken',
      '*.creditCard',
    ],
    remove: true,
  },
  ...(env.NODE_ENV !== 'production' && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname,service',
      },
    },
  }),
});

export const httpLogger = pinoHttp({
  logger,
  genReqId: (req: IncomingMessage) =>
    (req.headers['x-request-id'] as string) || crypto.randomUUID(),
  customLogLevel: (_req: IncomingMessage, res: ServerResponse, err?: Error) => {
    if (res.statusCode >= 500 || err) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
  autoLogging: {
    ignore: (req: IncomingMessage) => req.url === '/health' || req.url === '/api/v2/health',
  },
  customProps: (req: IncomingMessage) => ({
    reqId: (req as { id?: unknown }).id,
  }),
});
