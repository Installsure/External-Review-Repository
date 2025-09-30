import { cache } from '../../infra/redis.js';
import { logger } from '../../infra/logger.js';
// Cache middleware for GET requests
export const cacheMiddleware = (options = {}) => {
    const { ttl = 300, // 5 minutes default
    prefix = 'api', keyGenerator = defaultKeyGenerator, condition = defaultCondition } = options;
    return async (req, res, next) => {
        // Only cache GET requests
        if (req.method !== 'GET') {
            return next();
        }
        // Check if caching is enabled for this request
        if (!condition(req, res)) {
            return next();
        }
        const cacheKey = keyGenerator(req);
        const childLogger = logger.child({ requestId: req.requestId, cacheKey });
        try {
            // Try to get from cache
            const cachedData = await cache.get(cacheKey, { prefix, ttl });
            if (cachedData !== null) {
                childLogger.debug('Cache hit');
                res.set('X-Cache', 'HIT');
                return res.json(cachedData);
            }
            childLogger.debug('Cache miss');
            // Override res.json to cache the response
            const originalJson = res.json.bind(res);
            res.json = function (data) {
                // Cache the response data
                cache.set(cacheKey, data, { prefix, ttl }).catch(error => {
                    childLogger.error({ error: error.message }, 'Failed to cache response');
                });
                res.set('X-Cache', 'MISS');
                return originalJson(data);
            };
            next();
        }
        catch (error) {
            childLogger.error({ error: error.message }, 'Cache middleware error');
            next();
        }
    };
};
// Default key generator
const defaultKeyGenerator = (req) => {
    const userId = req.user?.id || 'anonymous';
    const path = req.path;
    const query = JSON.stringify(req.query);
    return `${userId}:${path}:${query}`;
};
// Default condition - cache all GET requests except those with no-cache header
const defaultCondition = (req, res) => {
    return !req.headers['cache-control']?.includes('no-cache');
};
// Cache invalidation middleware
export const invalidateCache = (patterns) => {
    return async (req, res, next) => {
        const originalJson = res.json.bind(res);
        res.json = async function (data) {
            // Invalidate cache patterns after successful response
            if (res.statusCode >= 200 && res.statusCode < 300) {
                for (const pattern of patterns) {
                    try {
                        await cache.invalidatePattern(pattern);
                        logger.debug({ pattern, requestId: req.requestId }, 'Cache invalidated');
                    }
                    catch (error) {
                        logger.error({
                            error: error.message,
                            pattern,
                            requestId: req.requestId
                        }, 'Failed to invalidate cache');
                    }
                }
            }
            return originalJson(data);
        };
        next();
    };
};
// Cache decorator for service methods
export const cached = (options = {}) => {
    const { ttl = 300, prefix = 'service', keyGenerator } = options;
    return function (target, propertyName, descriptor) {
        const method = descriptor.value;
        descriptor.value = async function (...args) {
            const cacheKey = keyGenerator ? keyGenerator(...args) : `${target.constructor.name}:${propertyName}:${JSON.stringify(args)}`;
            try {
                // Try to get from cache
                const cachedResult = await cache.get(cacheKey, { prefix, ttl });
                if (cachedResult !== null) {
                    logger.debug({ cacheKey }, 'Service cache hit');
                    return cachedResult;
                }
                logger.debug({ cacheKey }, 'Service cache miss');
                // Execute the original method
                const result = await method.apply(this, args);
                // Cache the result
                await cache.set(cacheKey, result, { prefix, ttl });
                return result;
            }
            catch (error) {
                logger.error({
                    error: error.message,
                    cacheKey
                }, 'Service cache error');
                // Fall back to original method
                return method.apply(this, args);
            }
        };
        return descriptor;
    };
};
// Cache warming utility
export const warmCache = async (key, dataFetcher, options = {}) => {
    const { ttl = 300, prefix = 'warm' } = options;
    try {
        logger.info({ key }, 'Warming cache');
        const data = await dataFetcher();
        await cache.set(key, data, { prefix, ttl });
        logger.info({ key }, 'Cache warmed successfully');
        return data;
    }
    catch (error) {
        logger.error({ error: error.message, key }, 'Failed to warm cache');
        throw error;
    }
};
// Cache statistics endpoint
export const getCacheStats = async (req, res) => {
    try {
        const stats = await cache.get('stats', { prefix: 'redis' });
        res.json({
            cache: {
                enabled: true,
                stats: stats || { message: 'Cache stats not available' }
            }
        });
    }
    catch (error) {
        logger.error({ error: error.message }, 'Failed to get cache stats');
        res.status(500).json({ error: 'Failed to get cache statistics' });
    }
};
//# sourceMappingURL=cache.js.map