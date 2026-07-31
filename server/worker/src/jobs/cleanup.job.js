import logger from "../utils/logger.js";

// Database Models (pointing to server/src/models/)
import Campaign from "../../../src/models/Campaign.js";

/**
 * Periodically cleans up archived or expired data.
 */
export const runCleanupJob = async () => {
  logger.info("[CleanupJob] Starting database cleanup task...");

  try {
    const thresholdDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago

    // Example cleanup: Archive completed campaigns older than 30 days
    const result = await Campaign.updateMany(
      { status: "COMPLETED", updatedAt: { $lt: thresholdDate } },
      { $set: { status: "ARCHIVED" } },
    );

    logger.info(
      `[CleanupJob] Successfully archived ${result.modifiedCount} old campaigns.`,
    );
    return { status: "SUCCESS", archivedCount: result.modifiedCount };
  } catch (error) {
    logger.error(`[CleanupJob] Task failed: ${error.message}`);
    throw error;
  }
};

export default runCleanupJob;
