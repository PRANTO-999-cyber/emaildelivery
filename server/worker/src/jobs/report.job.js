import logger from "../utils/logger.js";

// Database Models (pointing to server/src/models/)
import Campaign from "../../../src/models/Campaign.js";

/**
 * Aggregates campaign performance summary reports.
 */
export const runReportJob = async () => {
  logger.info("[ReportJob] Generating campaign summary report...");

  try {
    const totalCampaigns = await Campaign.countDocuments({ status: "SENDING" });
    logger.info(
      `[ReportJob] Total active campaigns currently processing: ${totalCampaigns}`,
    );

    return { status: "SUCCESS", activeCampaigns: totalCampaigns };
  } catch (error) {
    logger.error(`[ReportJob] Report generation failed: ${error.message}`);
    throw error;
  }
};

export default runReportJob;
