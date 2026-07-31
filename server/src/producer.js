import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { Queue } from "bullmq";
import Redis from "ioredis";

// Resolve path to ensure .env is found from root or server subdirectories
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const QUEUE_NAME = "email-queue";

// 1. Initialize Redis Connection explicitly for the producer
const host = process.env.REDIS_HOST;
const port = Number(process.env.REDIS_PORT) || 6379;
const password = process.env.REDIS_PASSWORD || undefined;
const isTLS =
  process.env.REDIS_TLS === "true" || (host && host.includes("upstash.io"));

if (!host) {
  console.error("❌ REDIS_HOST is undefined. Check your .env path!");
  process.exit(1);
}

const redisConnection = new Redis({
  host,
  port,
  password,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  ...(isTLS && { tls: { rejectUnauthorized: false } }),
});

// 2. Initialize BullMQ Queue
const emailQueue = new Queue(QUEUE_NAME, {
  connection: redisConnection,
});

// 3. Producer Function
async function addTestEmailJob() {
  try {
    console.log(`[Producer] Connecting to Redis host (${host})...`);

    const jobPayload = {
      to: "test@example.com",
      subject: "Welcome to our Platform!",
      body: "This is a test email sent via BullMQ and Upstash Redis.",
    };

    // Add job to the queue
    const job = await emailQueue.add("send-welcome-email", jobPayload);

    console.log(`[Producer] ✅ Job queued successfully! Job ID: ${job.id}`);
  } catch (error) {
    console.error(`[Producer] ❌ Failed to queue job: ${error.message}`);
    process.exit(1);
  } finally {
    // Clean up connections so the script exits cleanly
    await emailQueue.close();
    await redisConnection.quit();
    process.exit(0);
  }
}

addTestEmailJob();
