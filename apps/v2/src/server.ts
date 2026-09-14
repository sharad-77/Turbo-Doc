import { app } from './app.js';
import { env } from './config/env.js';
import { pool } from './db/client.js';

const server = app.listen(env.PORT, env.HOST, () => {
  console.log(`Turbo-Doc API V2 listening on http://${env.HOST}:${env.PORT}`);
});

const shutdown = (signal: string) => {
  console.log(`${signal} received, shutting down`);

  server.close(() => {
    void pool.end().then(() => process.exit(0));
  });
};

process.once('SIGINT', () => shutdown('SIGINT'));
process.once('SIGTERM', () => shutdown('SIGTERM'));
