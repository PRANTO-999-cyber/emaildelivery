// server/worker/src/queues/retry.queue.js

import { Queue } from "bullmq";

import redis from "../config/redis.js";
import logger from "../config/logger.js";

export const retryQueue = new Queue("retry-queue", {
  connection: redis,

  defaultJobOptions: {
    attempts: 5,

    backoff: {
      type: "exponential",
      delay: 10000, // 10 seconds
    },

    removeOnComplete: 1000,

    removeOnFail: 5000,
  },
});

export const addRetryJob = async (jobName, payload, options = {}) => {
  try {
    const job = await retryQueue.add(jobName, payload, {
      priority: options.priority ?? 1,

      delay: options.delay ?? 0,

      jobId: options.jobId,

      ...options,
    });

    logger.info(`Retry job queued: ${job.id}`);

    return job;
  } catch (error) {
    logger.error("Unable to queue retry job.", error);

    throw error;
  }
};

export const getRetryQueueStats = async () => {
  return retryQueue.getJobCounts(
    "waiting",
    "active",
    "completed",
    "failed",
    "delayed",
    "paused",
  );
};

export const pauseRetryQueue = async () => {
  await retryQueue.pause();

  logger.warn("Retry queue paused.");
};

export const resumeRetryQueue = async () => {
  await retryQueue.resume();

  logger.success("Retry queue resumed.");
};

export const obliterateRetryQueue = async () => {
  await retryQueue.obliterate({
    force: true,
  });

  logger.warn("Retry queue cleared.");
};

export default retryQueue;
