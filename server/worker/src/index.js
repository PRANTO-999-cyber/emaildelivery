import "dotenv/config"; // Loads .env synchronously before anything else
import mongoose from "mongoose";
import { Worker } from "bullmq";
import logger from "./utils/logger.js";
import { getRedisConnection } from "./utils/redis.connection.js";

const QUEUE_NAME = "email-queue";

// 1. Initialize MongoDB Connection
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from environment variables.");
    }
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info("[MongoDB] Connected to database successfully.");
  } catch (error) {
    logger.error(`[MongoDB] Database connection error: ${error.message}`);
    process.exit(1);
  }
};

await connectDB();

// 2. Initialize Redis Connection after env is loaded
const redisConn = getRedisConnection();

// 3. Define BullMQ Worker Processor
const emailWorker = new Worker(
  QUEUE_NAME,
  async (job) => {
    logger.info(`[Job ${job.id}] Processing email task: ${job.name}`);

    // Example payload extraction:
    // const { recipient, subject, body } = job.data;
    // await sendEmail({ recipient, subject, body });

    return { status: "delivered", timestamp: new Date() };
  },
  {
    connection: redisConn,
    concurrency: 5,
    skipVersionCheck: true, // Suppresses Upstash eviction policy warnings
  },
);

// Worker Event Handlers
emailWorker.on("completed", (job) => {
  logger.info(`[Job ${job.id}] Job completed successfully.`);
});

emailWorker.on("failed", (job, err) => {
  logger.error(`[Job ${job?.id || "unknown"}] Job failed: ${err.message}`);
});

logger.info(`Email processor worker started with ID: ${QUEUE_NAME}`);

// 4. Graceful Shutdown Handlers
const gracefulShutdown = async (signal) => {
  logger.info(`[Worker] Received ${signal}. Starting graceful shutdown...`);

  try {
    // Stop accepting new jobs and finish active jobs
    await emailWorker.close();
    logger.info("[BullMQ] Worker closed.");

    // Close Redis connection
    await redisConn.quit();
    logger.info("[Redis] Connection closed.");

    // Close Mongoose connection
    await mongoose.connection.close();
    logger.info("[MongoDB] Connection closed.");

    process.exit(0);
  } catch (error) {
    logger.error(`[Worker] Error during shutdown: ${error.message}`);
    process.exit(1);
  }
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
