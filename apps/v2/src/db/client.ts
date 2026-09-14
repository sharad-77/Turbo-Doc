import pg from 'pg';

import { env } from '../config/env.js';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

export const query = <Result extends pg.QueryResultRow = pg.QueryResultRow>(
  text: string,
  values: unknown[] = []
) => pool.query<Result>(text, values);
