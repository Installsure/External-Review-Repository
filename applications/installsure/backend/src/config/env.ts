import { z } from "zod";
import dotenv from 'dotenv';

dotenv.config();

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

// Legacy export for backward compatibility
export const config = {
  NODE_ENV: env.NODE_ENV,
  PORT: env.PORT,
  CORS_ORIGINS: env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  DATABASE_URL: process.env.DATABASE_URL || '',
  FORGE_CLIENT_ID: process.env.FORGE_CLIENT_ID || '',
  FORGE_CLIENT_SECRET: process.env.FORGE_CLIENT_SECRET || '',
  FORGE_BASE_URL: process.env.FORGE_BASE_URL || 'https://developer.api.autodesk.com',
  FORGE_BUCKET: process.env.FORGE_BUCKET || 'installsure-dev',
  SENTRY_DSN: process.env.SENTRY_DSN || '',
  QB_CLIENT_ID: process.env.QB_CLIENT_ID || '',
  QB_CLIENT_SECRET: process.env.QB_CLIENT_SECRET || '',
  REDIS_URL: env.REDIS_URL || 'redis://localhost:6379',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};
