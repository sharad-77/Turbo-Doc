import type { Request, Response } from 'express';

export const notFoundHandler = (request: Request, response: Response) => {
  response.status(404).json({
    status: 'error',
    message: `Route ${request.method} ${request.originalUrl} not found`,
  });
};
