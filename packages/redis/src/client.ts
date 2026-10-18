import { Redis } from 'ioredis';

export type RedisPurpose = 'app';

export function createRedis(purpose: RedisPurpose, opts: { url: string }): Redis {
  const client = new Redis(opts.url, {
    maxRetriesPerRequest: 2,
    connectTimeout: 5000,
    enableOfflineQueue: false,
    retryStrategy: times => Math.min(times * 200, 2000),
  });

  client.on('error', (err: unknown) => {
    const errorObj = err as { code?: string; message?: string };
    console.error(`[redis:${purpose}]`, errorObj.code ?? errorObj.message);
  });

  return client;
}

export const client = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: 2,
  connectTimeout: 5000,
  enableOfflineQueue: true,
  retryStrategy: times => Math.min(times * 200, 2000),
  lazyConnect: true,
});

client.on('error', (err: unknown) => {
  const errorObj = err as { code?: string; message?: string };
  console.error('[redis:app]', errorObj.code ?? errorObj.message);
});

export async function closeRedis(targetClient: Redis = client): Promise<void> {
  try {
    if (targetClient.status !== 'end') {
      await targetClient.quit();
    }
  } catch {
    try {
      targetClient.disconnect();
    } catch {
      // ignore force disconnect error
    }
  }
}

