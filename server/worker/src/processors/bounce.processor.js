import { Worker } from "bullmq";

// Worker Utilities
import logger from "../utils/logger.js";
import redisConnection from "../utils/redis.connection.js";

// Database Models (pointing to server/src/models/)
import Contact from "../../../src/models/Contact.js";
import Campaign from "../../../src/models/Campaign.js";

/**
 * Process hard and soft email bounce events.
 *
 * @param {import('bullmq').Job} job - BullMQ job containing bounce details.
 */
export const processBounceJob = async (job) => {
  const { campaignId, contactId, tenantId, bounceType, reason } = job.data;

  logger.info(
    `[BounceProcessor] Processing ${bounceType} bounce for Contact: ${contactId}`,
  );

  try {
    // If Hard Bounce, mark contact as unsubscribed/bounced
    if (bounceType === "HARD") {
      await Contact.updateOne(
        { _id: contactId, tenantId },
        { $set: { status: "BOUNCED", bounceReason: reason } },
      );
    }

    // Update Campaign bounce counts
    if (campaignId) {
      await Campaign.updateOne(
        { _id: campaignId, tenantId },
        { $inc: { "stats.bounces": 1 } },
      );
    }

    logger.info(
      `[BounceProcessor] Successfully processed bounce for Contact ${contactId}`,
    );

    return { status: "PROCESSED", contactId, bounceType };
  } catch (error) {
    logger.error(`[BounceProcessor] Error in job ${job.id}: ${error.message}`);
    throw error;
  }
};

/**
 * BullMQ Bounce Worker Instance
 */
export const bounceWorker = new Worker("bounce-queue", processBounceJob, {
  connection: redisConnection,
  concurrency: 5,
});

bounceWorker.on("completed", (job) => {
  logger.info(`[BounceWorker Event] Job ${job.id} completed successfully.`);
});

bounceWorker.on("failed", (job, err) => {
  logger.error(
    `[BounceWorker Event] Job ${job?.id} failed with error: ${err.message}`,
  );
});

// Provides default export so 'import bounceProcessor from ...' works seamlessly
export default bounceWorker;
