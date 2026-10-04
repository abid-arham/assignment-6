export declare function getOrSetCache<T>(key: string, ttlSeconds: number, fetcher: () => Promise<T>): Promise<T>;
export declare function invalidateCacheByPrefix(prefix: string): Promise<void>;
//# sourceMappingURL=cache.d.ts.map