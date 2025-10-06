import IORedis, { Cluster } from "ioredis";
import { env } from "../config/env.js";

export type RedisClient = IORedis.Redis | Cluster;

let client: RedisClient | null = null;

function createSingle(): IORedis.Redis {
  return new IORedis({
    host: env.REDIS_HOST ?? undefined,
    port: env.REDIS_PORT ?? undefined,
    password: env.REDIS_PASSWORD ?? undefined,
    lazyConnect: true,
    enableAutoPipelining: true,
    maxRetriesPerRequest: null,
    reconnectOnError: (err) => {
      const msg = String(err?.message ?? "").toLowerCase();
      return msg.includes("moved") || msg.includes("read only");
    },
  });
}

function createCluster(): Cluster {
  const nodes = (env.REDIS_CLUSTER_NODES ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((hp) => {
      const [host, port] = hp.split(":");
      return { host, port: Number(port ?? 6379) };
    });

  if (!nodes.length) throw new Error("REDIS_CLUSTER_NODES is empty");

  return new Cluster(nodes, {
    redisOptions: {
      password: env.REDIS_PASSWORD ?? undefined,
      enableAutoPipelining: true,
      maxRetriesPerRequest: null,
    },
    scaleReads: "slave",
    slotsRefreshTimeout: 2000,
  });
}

export async function getRedis(): Promise<RedisClient> {
  if (client) return client;

  if (env.REDIS_URL) {
    client = new IORedis(env.REDIS_URL, { lazyConnect: true, enableAutoPipelining: true });
  } else if (env.REDIS_CLUSTER_NODES) {
    client = createCluster();
  } else {
    client = createSingle();
  }

  // @ts-ignore connect exists on both single/cluster at runtime
  await client.connect?.();
  return client!;
}

export async function pingRedis(): Promise<boolean> {
  const r = await getRedis();
  // @ts-ignore both support ping
  const res = await r.ping();
  return String(res).toUpperCase() === "PONG";
}

export async function closeRedis(): Promise<void> {
  if (!client) return;
  try {
    // @ts-ignore both support quit
    await client.quit?.();
  } finally {
    client = null;
  }
}

process.once("SIGINT", () => void closeRedis());
process.once("SIGTERM", () => void closeRedis());
