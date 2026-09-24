import { redis } from "../config/redis";

export async function getOrSetCache<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>
): Promise<T> {
  if (!redis) return fetcher();

  const cached = await redis.get<T>(key);
  if (cached !== null && cached !== undefined) return cached;

  const fresh = await fetcher();
  await redis.set(key, fresh, { ex: ttlSeconds });
  return fresh;
}

export async function invalidateCacheByPrefix(prefix: string) {
  if (!redis) return;
  const keys = await redis.keys(`${prefix}*`);
  if (keys.length) await redis.del(...keys);
}
