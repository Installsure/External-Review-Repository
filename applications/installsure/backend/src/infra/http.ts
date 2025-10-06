import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import fastifyRateLimit from "@fastify/rate-limit";
import { env, isProd } from "../config/env.js";
import { pingRedis } from "./redis.js";

export function createServer() {
  const app = Fastify({ logger: !isProd });

  app.register(fastifyHelmet);
  app.register(fastifyCors, { origin: env.CORS_ORIGIN ?? true });
  app.register(fastifyRateLimit, { max: env.RATE_LIMIT_MAX, timeWindow: "1 minute" });

  app.get("/health", async () => {
    const redisOk = await pingRedis().catch(() => false);
    return { ok: true, redis: redisOk };
  });

  app.setErrorHandler((err, _req, reply) => {
    const status = err.statusCode ?? 500;
    const body = {
      error: status >= 500 ? "Internal Server Error" : "Bad Request",
      message: isProd && status >= 500 ? "Something went wrong" : err.message,
    };
    reply.code(status).send(body);
  });

  return app;
}

