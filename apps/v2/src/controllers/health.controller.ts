import type { Request, Response } from 'express';

import { query } from '../db/client.js';

export const getLiveness = (_request: Request, response: Response) => {
  response.status(200).json({
    status: 'ok',
    service: 'turbo-doc-api-v2',
  });
};

export const getReadiness = async (_request: Request, response: Response) => {
  await query('SELECT 1');

  response.status(200).json({
    status: 'ready',
    service: 'turbo-doc-api-v2',
    dependencies: {
      postgres: 'ready',
    },
  });
};
