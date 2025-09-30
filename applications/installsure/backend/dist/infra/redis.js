import Redis from 'ioredis';
import { config } from './config.js';
import { logger } from './logger.js';
class RedisManager {
    client = null;
    isConnected = false;
    constructor() {
        this.initializeRedis();
    }
    initializeRedis() {
        try {
            const redisConfig = {
                host: 'localhost',
                port: 6379,
                db: 0,
                retryDelayOnFailover: 100,
                maxRetriesPerRequest: 3,
                lazyConnect: true
            };
            // Parse Redis URL if provided
            if (config.REDIS_URL) {
                const redisUrl = new URL(config.REDIS_URL);
                redisConfig.host = redisUrl.hostname;
                redisConfig.port = parseInt(redisUrl.port) || 6379;
                redisConfig.password = redisUrl.password || undefined;
                redisConfig.db = parseInt(redisUrl.pathname.slice(1)) || 0;
            }
            this.client = new Redis(redisConfig);
            this.client.on('connect', () => {
                logger.info('Redis connected');
                this.isConnected = true;
            });
            this.client.on('ready', () => {
                logger.info('Redis ready');
            });
            this.client.on('error', (error) => {
                logger.error({ error: error.message }, 'Redis error');
                this.isConnected = false;
            });
            this.client.on('close', () => {
                logger.info('Redis connection closed');
                this.isConnected = false;
            });
            this.client.on('reconnecting', () => {
                logger.info('Redis reconnecting');
            });
        }
        catch (error) {
            logger.error({ error: error.message }, 'Failed to initialize Redis');
            this.client = null;
        }
    }
    async connect() {
        if (this.client && !this.isConnected) {
            try {
                await this.client.connect();
            }
            catch (error) {
                logger.error({ error: error.message }, 'Failed to connect to Redis');
                throw error;
            }
        }
    }
    async disconnect() {
        if (this.client) {
            await this.client.disconnect();
            this.isConnected = false;
        }
    }
    isHealthy() {
        return this.isConnected && this.client !== null;
    }
    // Basic cache operations
    async set(key, value, ttl) {
        if (!this.client)
            return false;
        try {
            const serialized = JSON.stringify(value);
            if (ttl) {
                await this.client.setex(key, ttl, serialized);
            }
            else {
                await this.client.set(key, serialized);
            }
            return true;
        }
        catch (error) {
            logger.error({ error: error.message, key }, 'Failed to set cache');
            return false;
        }
    }
    async get(key) {
        if (!this.client)
            return null;
        try {
            const value = await this.client.get(key);
            if (value === null)
                return null;
            return JSON.parse(value);
        }
        catch (error) {
            logger.error({ error: error.message, key }, 'Failed to get cache');
            return null;
        }
    }
    async del(key) {
        if (!this.client)
            return false;
        try {
            const result = await this.client.del(key);
            return result > 0;
        }
        catch (error) {
            logger.error({ error: error.message, key }, 'Failed to delete cache');
            return false;
        }
    }
    async exists(key) {
        if (!this.client)
            return false;
        try {
            const result = await this.client.exists(key);
            return result === 1;
        }
        catch (error) {
            logger.error({ error: error.message, key }, 'Failed to check cache existence');
            return false;
        }
    }
    async expire(key, ttl) {
        if (!this.client)
            return false;
        try {
            const result = await this.client.expire(key, ttl);
            return result === 1;
        }
        catch (error) {
            logger.error({ error: error.message, key }, 'Failed to set cache expiration');
            return false;
        }
    }
    // Advanced cache operations
    async mget(keys) {
        if (!this.client || keys.length === 0)
            return [];
        try {
            const values = await this.client.mget(...keys);
            return values.map(value => value ? JSON.parse(value) : null);
        }
        catch (error) {
            logger.error({ error: error.message, keys }, 'Failed to get multiple cache values');
            return [];
        }
    }
    async mset(keyValuePairs, ttl) {
        if (!this.client || Object.keys(keyValuePairs).length === 0)
            return false;
        try {
            const serializedPairs = [];
            for (const [key, value] of Object.entries(keyValuePairs)) {
                serializedPairs.push(key, JSON.stringify(value));
            }
            await this.client.mset(...serializedPairs);
            if (ttl) {
                const pipeline = this.client.pipeline();
                for (const key of Object.keys(keyValuePairs)) {
                    pipeline.expire(key, ttl);
                }
                await pipeline.exec();
            }
            return true;
        }
        catch (error) {
            logger.error({ error: error.message }, 'Failed to set multiple cache values');
            return false;
        }
    }
    async keys(pattern) {
        if (!this.client)
            return [];
        try {
            return await this.client.keys(pattern);
        }
        catch (error) {
            logger.error({ error: error.message, pattern }, 'Failed to get cache keys');
            return [];
        }
    }
    async flush() {
        if (!this.client)
            return false;
        try {
            await this.client.flushdb();
            return true;
        }
        catch (error) {
            logger.error({ error: error.message }, 'Failed to flush cache');
            return false;
        }
    }
    // Hash operations for complex data
    async hset(key, field, value) {
        if (!this.client)
            return false;
        try {
            await this.client.hset(key, field, JSON.stringify(value));
            return true;
        }
        catch (error) {
            logger.error({ error: error.message, key, field }, 'Failed to set hash field');
            return false;
        }
    }
    async hget(key, field) {
        if (!this.client)
            return null;
        try {
            const value = await this.client.hget(key, field);
            if (value === null)
                return null;
            return JSON.parse(value);
        }
        catch (error) {
            logger.error({ error: error.message, key, field }, 'Failed to get hash field');
            return null;
        }
    }
    async hgetall(key) {
        if (!this.client)
            return null;
        try {
            const hash = await this.client.hgetall(key);
            if (Object.keys(hash).length === 0)
                return null;
            const result = {};
            for (const [field, value] of Object.entries(hash)) {
                result[field] = JSON.parse(value);
            }
            return result;
        }
        catch (error) {
            logger.error({ error: error.message, key }, 'Failed to get hash');
            return null;
        }
    }
    async hdel(key, field) {
        if (!this.client)
            return false;
        try {
            const result = await this.client.hdel(key, field);
            return result > 0;
        }
        catch (error) {
            logger.error({ error: error.message, key, field }, 'Failed to delete hash field');
            return false;
        }
    }
    // List operations
    async lpush(key, value) {
        if (!this.client)
            return null;
        try {
            return await this.client.lpush(key, JSON.stringify(value));
        }
        catch (error) {
            logger.error({ error: error.message, key }, 'Failed to push to list');
            return null;
        }
    }
    async rpop(key) {
        if (!this.client)
            return null;
        try {
            const value = await this.client.rpop(key);
            if (value === null)
                return null;
            return JSON.parse(value);
        }
        catch (error) {
            logger.error({ error: error.message, key }, 'Failed to pop from list');
            return null;
        }
    }
    async lrange(key, start, stop) {
        if (!this.client)
            return [];
        try {
            const values = await this.client.lrange(key, start, stop);
            return values.map(value => JSON.parse(value));
        }
        catch (error) {
            logger.error({ error: error.message, key }, 'Failed to get list range');
            return [];
        }
    }
    // Cache statistics
    async getStats() {
        if (!this.client)
            return null;
        try {
            const info = await this.client.info('memory');
            const dbSize = await this.client.dbsize();
            return {
                connected: this.isConnected,
                dbSize,
                memoryInfo: info
            };
        }
        catch (error) {
            logger.error({ error: error.message }, 'Failed to get Redis stats');
            return null;
        }
    }
}
// Create singleton instance
export const redisManager = new RedisManager();
// Cache helper functions
export const cache = {
    async set(key, value, options) {
        const fullKey = options?.prefix ? `${options.prefix}:${key}` : key;
        return redisManager.set(fullKey, value, options?.ttl);
    },
    async get(key, options) {
        const fullKey = options?.prefix ? `${options.prefix}:${key}` : key;
        return redisManager.get(fullKey);
    },
    async del(key, options) {
        const fullKey = options?.prefix ? `${options.prefix}:${key}` : key;
        return redisManager.del(fullKey);
    },
    async exists(key, options) {
        const fullKey = options?.prefix ? `${options.prefix}:${key}` : key;
        return redisManager.exists(fullKey);
    },
    async invalidatePattern(pattern) {
        const keys = await redisManager.keys(pattern);
        if (keys.length === 0)
            return true;
        try {
            if (redisManager.client) {
                await redisManager.client.del(...keys);
            }
            return true;
        }
        catch (error) {
            logger.error({ error: error.message, pattern }, 'Failed to invalidate cache pattern');
            return false;
        }
    }
};
export default redisManager;
//# sourceMappingURL=redis.js.map