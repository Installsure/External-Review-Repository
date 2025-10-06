import { Queue, Worker, QueueEvents, JobsOptions } from "bullmq";
import { getRedis } from "./redis.js";

export type UploadJob = {
  userId: string;
  fileId: string;
  filename: string;
  size: number;
};

const DEFAULT_OPTS: JobsOptions = {
  attempts: 5,
  backoff: {
    type: "exponential",
    delay: 1000,
  },
  removeOnComplete: 1000,
  removeOnFail: 1000,
  timeout: 5 * 60_000,
};

async function connection() {
  const r = await getRedis();
  // BullMQ accepts an IORedis instance as connection
  // @ts-expect-error acceptable per BullMQ typing
  return r;
}

export async function makeUploadQueue() {
  const conn = await connection();
  const queue = new Queue<UploadJob>("upload", { connection: conn });

  const events = new QueueEvents("upload", { connection: conn });
  events.on("failed", ({ jobId, failedReason }) => {
    console.error(`[queue:upload] job ${jobId} failed: ${failedReason}`);
  });

  return {
    queue,
    async enqueue(job: UploadJob, opts: JobsOptions = {}) {
      return queue.add("process-upload", job, { ...DEFAULT_OPTS, ...opts });
    },
    dispose: async () => {
      await events.close();
      await queue.close();
    },
  };
}

export async function makeUploadWorker(handler: (job: UploadJob) => Promise<void>) {
  const conn = await connection();
  const worker = new Worker<UploadJob>(
    "upload",
    async (job) => handler(job.data),
    { connection: conn, concurrency: 5 }
  );

  worker.on("failed", (job, err) => {
    console.error(`[worker:upload] job ${job?.id} failed`, err);
  });

  return worker;
}

  const stubQueue = (name: string) =>
    ({
      name,
      async add(jobName: string, data: any, opts?: any) {
        logger.debug({ jobName, data }, `Stub queue ${name} received job`);
        return { id: `${Date.now()}` } as any;
      },
      async close() {
        logger.debug(`Stub queue ${name} closed`);
      },
    }) as unknown as Queue;

  translationQueue = stubQueue('translation');
  emailQueue = stubQueue('email');
}

// Job types
export interface TranslationJobData {
  urn: string;
  objectId: string;
  fileName: string;
  requestId: string;
}

export interface EmailJobData {
  to: string;
  subject: string;
  template: string;
  data: Record<string, any>;
  requestId: string;
}

// Queue health check
export const isQueueHealthy = async (): Promise<boolean> => {
  if (isTest) return true;

  try {
    if (!redis) return false;
    await redis.ping();
    return true;
  } catch (error) {
    logger.error({ error: (error as Error).message }, 'Queue health check failed');
    return false;
  }
};

// Graceful shutdown
export const closeQueues = async (): Promise<void> => {
  logger.info('Closing queues...');

  try {
    const ops: Promise<any>[] = [];
    if (translationQueue && typeof (translationQueue as any).close === 'function')
      ops.push((translationQueue as any).close());
    if (emailQueue && typeof (emailQueue as any).close === 'function')
      ops.push((emailQueue as any).close());
    if (redis && typeof redis.disconnect === 'function')
      ops.push(Promise.resolve(redis.disconnect()));

    await Promise.all(ops);
    logger.info('Queues closed');
  } catch (error) {
    logger.error({ error: (error as Error).message }, 'Error closing queues');
  }
};

// Job processors (these would be implemented in separate worker processes in production)
export const createTranslationWorker = () => {
  return new Worker<TranslationJobData>(
    'translation',
    async (job: Job<TranslationJobData>) => {
      const { urn, objectId, fileName, requestId } = job.data;
      const jobLogger = logger.child({ requestId, jobId: job.id });

      jobLogger.info({ urn, objectId, fileName }, 'Processing translation job');

      try {
        // This would contain the actual translation logic
        // For now, we'll just simulate processing
        await new Promise((resolve) => setTimeout(resolve, 5000));

        jobLogger.info({ urn }, 'Translation job completed');

        return { success: true, urn };
      } catch (error) {
        jobLogger.error({ error: (error as Error).message }, 'Translation job failed');
        throw error;
      }
    },
    {
      connection: redis as any,
      concurrency: 2,
    },
  );
};

export const createEmailWorker = () => {
  return new Worker<EmailJobData>(
    'email',
    async (job: Job<EmailJobData>) => {
      const { to, subject, template, data, requestId } = job.data;
      const jobLogger = logger.child({ requestId, jobId: job.id });

      jobLogger.info({ to, subject }, 'Processing email job');

      try {
        // This would contain the actual email sending logic
        // For now, we'll just simulate sending
        await new Promise((resolve) => setTimeout(resolve, 1000));

        jobLogger.info({ to }, 'Email job completed');

        return { success: true };
      } catch (error) {
        jobLogger.error({ error: (error as Error).message }, 'Email job failed');
        throw error;
      }
    },
    {
      connection: redis as any,
      concurrency: 5,
    },
  );
};
