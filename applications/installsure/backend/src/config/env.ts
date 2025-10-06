import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(8000),

  // Redis (choose one)
  REDIS_URL: z.string().url().optional(),
  REDIS_HOST: z.string().optional(),
  REDIS_PORT: z.coerce.number().int().positive().optional(),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_CLUSTER_NODES: z.string().optional(), // "host1:6379,host2:6379"

  // HTTP
  CORS_ORIGIN: z.string().optional(), // "*" or explicit
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(300),
});

export type Env = z.infer<typeof EnvSchema>;
export const env: Env = EnvSchema.parse(process.env);
export const isProd = env.NODE_ENV === "production";
