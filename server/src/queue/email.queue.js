import { Queue } from "bullmq";
import Redis from "ioredis";

const host = process.env.REDIS_HOST;
const port = Number(process.env.REDIS_PORT) || 6379;
const password = process.env.REDIS_PASSWORD || undefined;
const isTLS =
  process.env.REDIS_TLS === "true" || (host && host.includes("upstash.io"));

const redisConnection = new Redis({
  host,
  port,
  password,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  ...(isTLS && { tls: { rejectUnauthorized: false } }),
});

export const emailQueue = new Queue("email-queue", {
  connection: redisConnection,
});
