import type { Redis } from 'ioredis';

export async function pingRedis(client: Redis, timeoutMs = 2000): Promise<boolean> {
  try {
    const res = await Promise.race([
      client.ping(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeoutMs)),
    ]);
    return res === 'PONG';
  } catch {
    return false;
  }
}
