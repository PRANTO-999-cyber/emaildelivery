// server/worker/src/queues/warmup.queue.js

import { Queue } from "bullmq";

import redis from "../config/redis.js";
import logger from "../config/logger.js";

export const warmupQueue = new Queue("warmup-queue", {
  connection: redis,

  defaultJobOptions: {
    attempts: 3,

    backoff: {
      type: "exponential",
      delay: 30000, // 30 seconds
    },

    removeOnComplete: 1000,

    removeOnFail: 5000,
  },
});

/**
 * Add a warmup email job
 */
export const addWarmupJob = async (data, options = {}) => {
  try {
    const job = await warmupQueue.add("warmup-email", data, {
      priority: options.priority ?? 1,

      delay: options.delay ?? 0,

      jobId: options.jobId,

      ...options,
    });

    logger.info(`Warmup job queued: ${job.id}`);

    return job;
  } catch (error) {
    logger.error("Failed to queue warmup job.", error);

    throw error;
  }
};

/**
 * Queue statistics
 */
export const getWarmupQueueStats = async () => {
  return warmupQueue.getJobCounts(
    "waiting",
    "active",
    "completed",
    "failed",
    "delayed",
    "paused",
  );
};

/**
 * Pause queue
 */
export const pauseWarmupQueue = async () => {
  await warmupQueue.pause();

  logger.warn("Warmup queue paused.");
};

/**
 * Resume queue
 */
export const resumeWarmupQueue = async () => {
  await warmupQueue.resume();

  logger.success("Warmup queue resumed.");
};

/**
 * Clean completed jobs
 */
export const cleanWarmupQueue = async () => {
  await warmupQueue.clean(24 * 60 * 60 * 1000, 1000, "completed");

  logger.info("Warmup queue cleaned.");
};

/**
 * Remove all jobs
 */
export const clearWarmupQueue = async () => {
  await warmupQueue.obliterate({
    force: true,
  });

  logger.warn("Warmup queue cleared.");
};

export default warmupQueue;
