import { Worker } from "bullmq";

// Worker Utilities
import logger from "../utils/logger.js";
import redisConnection from "../utils/redis.connection.js";

// Database Models (pointing to server/src/models/)
import SMTP from "../../../src/models/SMTP.js";

/**
 * Handles IP/Domain/SMTP account warm-up schedule progression.
 *
 * @param {import('bullmq').Job} job - BullMQ job containing warmup parameters.
 */
export const processWarmupJob = async (job) => {
  const { smtpId, tenantId, dailyLimitIncrement } = job.data;

  logger.info(
    `[WarmupProcessor] Processing warm-up increment for SMTP ID: ${smtpId}`,
  );

  try {
    const smtpConfig = await SMTP.findOne({ _id: smtpId, tenantId });

    if (!smtpConfig) {
      throw new Error(`SMTP configuration not found: ${smtpId}`);
    }

    // Gradually ramp up daily send limit
    const updatedLimit =
      (smtpConfig.dailyLimit || 100) + (dailyLimitIncrement || 50);

    await SMTP.updateOne(
      { _id: smtpId, tenantId },
      { $set: { dailyLimit: updatedLimit, lastWarmedAt: new Date() } },
    );

    logger.info(
      `[WarmupProcessor] Updated daily limit for SMTP ${smtpId} to ${updatedLimit}`,
    );

    return { status: "WARMED", newLimit: updatedLimit };
  } catch (error) {
    logger.error(`[WarmupProcessor] Error in job ${job.id}: ${error.message}`);
    throw error;
  }
};

/**
 * BullMQ Warmup Worker Instance
 */
export const warmupWorker = new Worker("warmup-queue", processWarmupJob, {
  connection: redisConnection,
  concurrency: 2,
});

warmupWorker.on("completed", (job, result) => {
  logger.info(
    `[WarmupWorker Event] Job ${job.id} completed. New limit: ${result?.newLimit}`,
  );
});

warmupWorker.on("failed", (job, err) => {
  logger.error(
    `[WarmupWorker Event] Job ${job?.id} failed with error: ${err.message}`,
  );
});

export default warmupWorker;
