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

