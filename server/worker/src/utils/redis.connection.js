import Redis from "ioredis";
import logger from "./logger.js";

let redisInstance = null;

export const getRedisConnection = () => {
  if (redisInstance) return redisInstance;

  const host = process.env.REDIS_HOST || "127.0.0.1";
  const port = Number(process.env.REDIS_PORT) || 6379;
  const password = process.env.REDIS_PASSWORD || undefined;
  const isTLS = process.env.REDIS_TLS === "true" || host.includes("upstash.io");

  logger.info(`[Redis] Connecting to host: ${host}:${port}`);

  redisInstance = new Redis({
    host,
    port,
    password,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    ...(isTLS && { tls: { rejectUnauthorized: false } }),
  });

  redisInstance.on("connect", () => {
    logger.info("[Redis] Connected to Upstash Redis successfully.");
  });

  redisInstance.on("error", (err) => {
    logger.error(`[Redis] Connection error: ${err.message}`);
  });

  return redisInstance;
};

export const redisConnection = getRedisConnection();
export default redisConnection;
