import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { config } from './config.js';
import { logger } from './logger.js';
// If running in test environment, avoid connecting to Redis/BullMQ.
// Provide no-op queues and a healthy check to make unit tests deterministic.
const isTest = process.env.NODE_ENV === 'test' || config.NODE_ENV === 'test';
let redis = null;
let translationQueue = null;
let emailQueue = null;
if (!isTest) {
    // Real Redis connection
    redis = new IORedis(config.REDIS_URL || 'redis://localhost:6379', {
        maxRetriesPerRequest: 3,
    });
    // Queue definitions
    translationQueue = new Queue('translation', {
        connection: redis,
        defaultJobOptions: {
            removeOnComplete: 10,
            removeOnFail: 5,
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 2000,
            },
        },
    });
    emailQueue = new Queue('email', {
        connection: redis,
        defaultJobOptions: {
            removeOnComplete: 10,
            removeOnFail: 5,
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 2000,
            },
        },
    });
}
else {
    // Provide simple in-memory stand-ins for queues in tests to avoid side effects
    logger.info('Running in test mode: queue connections disabled');
    // Minimal stubs implementing add() and close()
    const stubQueue = (name) => ({
        name,
        async add(jobName, data, opts) {
            logger.debug({ jobName, data }, `Stub queue ${name} received job`);
            return { id: `${Date.now()}` };
        },
        async close() {
            logger.debug(`Stub queue ${name} closed`);
        },
    });
    translationQueue = stubQueue('translation');
    emailQueue = stubQueue('email');
}
// Queue health check
export const isQueueHealthy = async () => {
    if (isTest)
        return true;
    try {
        if (!redis)
            return false;
        await redis.ping();
        return true;
    }
    catch (error) {
        logger.error({ error: error.message }, 'Queue health check failed');
        return false;
    }
};
// Graceful shutdown
export const closeQueues = async () => {
    logger.info('Closing queues...');
    try {
        const ops = [];
        if (translationQueue && typeof translationQueue.close === 'function')
            ops.push(translationQueue.close());
        if (emailQueue && typeof emailQueue.close === 'function')
            ops.push(emailQueue.close());
        if (redis && typeof redis.disconnect === 'function')
            ops.push(Promise.resolve(redis.disconnect()));
        await Promise.all(ops);
        logger.info('Queues closed');
    }
    catch (error) {
        logger.error({ error: error.message }, 'Error closing queues');
    }
};
// Job processors (these would be implemented in separate worker processes in production)
export const createTranslationWorker = () => {
    return new Worker('translation', async (job) => {
        const { urn, objectId, fileName, requestId } = job.data;
        const jobLogger = logger.child({ requestId, jobId: job.id });
        jobLogger.info({ urn, objectId, fileName }, 'Processing translation job');
        try {
            // This would contain the actual translation logic
            // For now, we'll just simulate processing
            await new Promise(resolve => setTimeout(resolve, 5000));
            jobLogger.info({ urn }, 'Translation job completed');
            return { success: true, urn };
        }
        catch (error) {
            jobLogger.error({ error: error.message }, 'Translation job failed');
            throw error;
        }
    }, {
        connection: redis,
        concurrency: 2,
    });
};
export const createEmailWorker = () => {
    return new Worker('email', async (job) => {
        const { to, subject, template, data, requestId } = job.data;
        const jobLogger = logger.child({ requestId, jobId: job.id });
        jobLogger.info({ to, subject }, 'Processing email job');
        try {
            // This would contain the actual email sending logic
            // For now, we'll just simulate sending
            await new Promise(resolve => setTimeout(resolve, 1000));
            jobLogger.info({ to }, 'Email job completed');
            return { success: true };
        }
        catch (error) {
            jobLogger.error({ error: error.message }, 'Email job failed');
            throw error;
        }
    }, {
        connection: redis,
        concurrency: 5,
    });
};
//# sourceMappingURL=queue.js.map