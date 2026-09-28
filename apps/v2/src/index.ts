import 'dotenv/config';
import http, { ServerResponse } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import Router from 'router';
import finalhandler from 'finalhandler';

import { env } from './config/env.js';
import { pool } from './db/client.js';
import { apiRouter } from './routes/index.js';
import { logger, httpLogger } from './middlewares/logger.js';
import { sendErrorResponse, sendSuccessResponse } from './utils/index.js';
import { HttpStatus } from './constants/index.js';
import { ExtendedRequest, NextFunctionInterface } from './interfaces/index.js';
import {
  HandleHttpException,
  ParseQueryStringMiddleware,
  PostgresErrorHandler,
  ZodErrorHandler,
} from './middlewares/index.js';

// initialise base router
const baseRouter = Router();

// security headers
baseRouter.use(helmet());

// enable cors
baseRouter.use(cors());

// parse request body
baseRouter.use(bodyParser.json({ limit: '10kb' }));
baseRouter.use(bodyParser.urlencoded({ extended: true, limit: '10kb' }));

// parse query string
baseRouter.use(ParseQueryStringMiddleware);

// pino http logging
baseRouter.use(httpLogger);

// set request id response header
baseRouter.use((req: ExtendedRequest, res: ServerResponse, next: NextFunctionInterface) => {
  if (req.id) {
    res.setHeader('x-request-id', String(req.id));
  }
  next();
});

// health check endpoint
baseRouter.get('/health', (_req: ExtendedRequest, res: ServerResponse) => {
  sendSuccessResponse(res, {
    data: { status: 'ok', uptime: process.uptime() },
    message: 'Health check OK',
  });
});

// mount api routes
baseRouter.use('/api/v2', apiRouter);

// handle zod validation errors
baseRouter.use(ZodErrorHandler);

// handle postgres database errors
baseRouter.use(PostgresErrorHandler);

// handle all http exceptions
baseRouter.use(HandleHttpException);

// handle unhandled internal server errors
baseRouter.use(
  (
    err: unknown,
    req: ExtendedRequest,
    res: ServerResponse,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: NextFunctionInterface
  ) => {
    const errorObj = err as { message?: string | { message?: string }; stack?: string } | null;
    const message =
      (typeof errorObj?.message === 'object' ? errorObj.message?.message : errorObj?.message) ||
      'Internal Server Error';
    let errorBody: { data?: unknown; message: string } = {
      message: typeof message === 'string' ? message : 'Internal Server Error',
    };
    if (env.NODE_ENV === 'development') {
      errorBody = {
        message: typeof message === 'string' ? message : 'Internal Server Error',
        data: errorObj?.stack,
      };
    }

    logger.error(
      {
        err,
        method: req.method,
        url: req.url,
        reqId: req.id,
      },
      `[UnhandledError] ${typeof message === 'object' ? JSON.stringify(message) : message}`
    );
    return sendErrorResponse(res, errorBody, HttpStatus.INTERNAL_SERVER_ERROR);
  }
);

// 404 not found handler
baseRouter.use((req: ExtendedRequest, res: ServerResponse) => {
  logger.warn(
    {
      method: req.method,
      url: req.url,
      reqId: req.id,
    },
    'Url Not Found'
  );
  sendErrorResponse(res, { message: 'Route Not Found' }, HttpStatus.NOT_FOUND);
});

// create HTTP Server
const server = http.createServer((req, res) => {
  // set default content type for all routes
  res.setHeader('Content-Type', 'application/json');

  // pass handler to baseRouter
  baseRouter(req, res, finalhandler(req, res));
});

// start server
server.listen(env.PORT, env.HOST, () => {
  logger.info(`Turbo-Doc API V2 listening on http://${env.HOST}:${env.PORT}`);
});

// graceful shutdown handling
let isShuttingDown = false;

const shutdown = (signal: string, exitCode = 0) => {
  if (isShuttingDown) return;
  isShuttingDown = true;

  logger.warn(`${signal} received, shutting down gracefully`);

  const forceTimer = setTimeout(() => {
    logger.error('Graceful shutdown timed out, force terminating');
    process.exit(1);
  }, 10_000);
  forceTimer.unref();

  server.close(() => {
    void pool
      .end()
      .then(() => {
        logger.info('Database pool closed');
        process.exit(exitCode);
      })
      .catch(err => {
        logger.error({ err }, 'Error during shutdown');
        process.exit(1);
      });
  });
};

process.once('SIGINT', () => shutdown('SIGINT'));
process.once('SIGTERM', () => shutdown('SIGTERM'));

process.on('uncaughtException', err => {
  logger.fatal({ err }, 'FATAL: Uncaught Exception');
  shutdown('UNCAUGHT_EXCEPTION', 1);
});

process.on('unhandledRejection', reason => {
  logger.fatal({ reason }, 'FATAL: Unhandled Rejection');
  shutdown('UNHANDLED_REJECTION', 1);
});

export { server, baseRouter };
