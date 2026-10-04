import { redis } from "../config/redis";
export async function getOrSetCache(key, ttlSeconds, fetcher) {
    if (!redis)
        return fetcher();
    const cached = await redis.get(key);
    if (cached !== null && cached !== undefined)
        return cached;
    const fresh = await fetcher();
    await redis.set(key, fresh, { ex: ttlSeconds });
    return fresh;
}
export async function invalidateCacheByPrefix(prefix) {
    if (!redis)
        return;
    const keys = await redis.keys(`${prefix}*`);
    if (keys.length)
        await redis.del(...keys);
}
//# sourceMappingURL=cache.js.map