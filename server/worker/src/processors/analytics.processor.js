import { Worker } from "bullmq";

// Worker Utilities
import logger from "../utils/logger.js";
import redisConnection from "../utils/redis.connection.js";

// Database Models (pointing to server/src/models/)
import Campaign from "../../../src/models/Campaign.js";

/**
 * Core processing function for analytics aggregation jobs.
 *
 * @param {import('bullmq').Job} job - BullMQ job containing payload details.
 */
export const processAnalyticsJob = async (job) => {
  const { campaignId, eventType, tenantId, timestamp } = job.data;

  logger.info(
    `[AnalyticsProcessor] Tracking ${eventType} for Campaign: ${campaignId}`,
  );

  try {
    const updateField =
      eventType === "OPEN"
        ? { "stats.opens": 1 }
        : eventType === "CLICK"
          ? { "stats.clicks": 1 }
          : null;

    if (!updateField) {
      logger.warn(`[AnalyticsProcessor] Unrecognized event type: ${eventType}`);
      return { status: "IGNORED" };
    }

    // Increment analytics counter on Campaign
    const result = await Campaign.updateOne(
      { _id: campaignId, tenantId },
      { $inc: updateField },
    );

    if (result.matchedCount === 0) {
      throw new Error(
        `Campaign not found: ${campaignId} for tenant ${tenantId}`,
      );
    }

    logger.info(
      `[AnalyticsProcessor] Successfully updated ${eventType} count for Campaign ${campaignId}`,
    );

    return { status: "PROCESSED", campaignId, eventType };
  } catch (error) {
    logger.error(
      `[AnalyticsProcessor] Error in job ${job.id}: ${error.message}`,
    );
    throw error;
  }
};

/**
 * BullMQ Analytics Worker Instance
 */
export const analyticsWorker = new Worker(
  "analytics-queue",
  processAnalyticsJob,
  {
    connection: redisConnection,
    concurrency: 5,
  },
);

// Worker Lifecycle Events
analyticsWorker.on("completed", (job, result) => {
  logger.info(
    `[AnalyticsWorker Event] Job ${job.id} completed. Event: ${result?.eventType}`,
  );
});

analyticsWorker.on("failed", (job, err) => {
  logger.error(
    `[AnalyticsWorker Event] Job ${job?.id} failed with error: ${err.message}`,
  );
});

export default analyticsWorker;
