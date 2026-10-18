import * as pg from "pg";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

export const query = <Result extends pg.QueryResultRow = pg.QueryResultRow>(
  text: string,
  values: unknown[] = []
) => pool.query<Result>(text, values);

pool.on('error', (err, client) => {
  // Log the error using your logger (e.g., Pino) if you have one set up
  console.error('Unexpected error on idle client', err);
});

export const closePool = async () => {
  try {
    await pool.end();
    console.log('Database pool closed cleanly.');
  } catch (err) {
    console.error('Error closing database pool', err);
  }
};
