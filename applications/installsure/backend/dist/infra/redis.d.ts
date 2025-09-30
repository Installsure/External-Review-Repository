export interface CacheOptions {
    ttl?: number;
    prefix?: string;
}
export interface RedisConfig {
    host: string;
    port: number;
    password?: string;
    db: number;
    retryDelayOnFailover: number;
    maxRetriesPerRequest: number;
    lazyConnect: boolean;
}
declare class RedisManager {
    private client;
    private isConnected;
    constructor();
    private initializeRedis;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    isHealthy(): boolean;
    set(key: string, value: any, ttl?: number): Promise<boolean>;
    get<T = any>(key: string): Promise<T | null>;
    del(key: string): Promise<boolean>;
    exists(key: string): Promise<boolean>;
    expire(key: string, ttl: number): Promise<boolean>;
    mget<T = any>(keys: string[]): Promise<(T | null)[]>;
    mset(keyValuePairs: Record<string, any>, ttl?: number): Promise<boolean>;
    keys(pattern: string): Promise<string[]>;
    flush(): Promise<boolean>;
    hset(key: string, field: string, value: any): Promise<boolean>;
    hget<T = any>(key: string, field: string): Promise<T | null>;
    hgetall<T = any>(key: string): Promise<Record<string, T> | null>;
    hdel(key: string, field: string): Promise<boolean>;
    lpush(key: string, value: any): Promise<number | null>;
    rpop<T = any>(key: string): Promise<T | null>;
    lrange<T = any>(key: string, start: number, stop: number): Promise<T[]>;
    getStats(): Promise<any>;
}
export declare const redisManager: RedisManager;
export declare const cache: {
    set<T>(key: string, value: T, options?: CacheOptions): Promise<boolean>;
    get<T>(key: string, options?: CacheOptions): Promise<T | null>;
    del(key: string, options?: CacheOptions): Promise<boolean>;
    exists(key: string, options?: CacheOptions): Promise<boolean>;
    invalidatePattern(pattern: string): Promise<boolean>;
};
export default redisManager;
//# sourceMappingURL=redis.d.ts.map