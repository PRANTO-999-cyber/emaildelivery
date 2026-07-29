// server/worker/jobs/cleanup.job.js

import Campaign from "../../models/Campaign.js";
import Tracking from "../../models/Tracking.js";
import Webhook from "../../models/Webhook.js";
import Warmup from "../../models/Warmup.js";
import User from "../../models/User.js";
import logger from "../config/logger.js";

const DAYS = (days) => {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
};

export const cleanupJob = async () => {
  logger.info("Starting cleanup job...");

  try {
    // ---------------------------------------
    // Delete old webhook logs (30 days)
    // ---------------------------------------

    const webhookResult = await Webhook.deleteMany({
      createdAt: {
        $lt: DAYS(30),
      },
    });

    logger.info(`Deleted ${webhookResult.deletedCount} webhook logs`);

    // ---------------------------------------
    // Delete old tracking records (90 days)
    // ---------------------------------------

    const trackingResult = await Tracking.deleteMany({
      createdAt: {
        $lt: DAYS(90),
      },
    });

    logger.info(`Deleted ${trackingResult.deletedCount} tracking records`);

    // ---------------------------------------
    // Remove expired password reset tokens
    // ---------------------------------------

    const userResult = await User.updateMany(
      {
        resetPasswordExpire: {
          $lt: new Date(),
        },
      },
      {
        $unset: {
          resetPasswordToken: "",
          resetPasswordExpire: "",
        },
      },
    );

    logger.info(
      `Cleared ${userResult.modifiedCount} expired password reset tokens`,
    );

    // ---------------------------------------
    // Delete cancelled campaigns older than 60 days
    // ---------------------------------------

    const campaignResult = await Campaign.deleteMany({
      status: "cancelled",
      updatedAt: {
        $lt: DAYS(60),
      },
    });

    logger.info(`Deleted ${campaignResult.deletedCount} cancelled campaigns`);

    // ---------------------------------------
    // Delete completed warmups older than 30 days
    // ---------------------------------------

    const warmupResult = await Warmup.deleteMany({
      status: "completed",
      updatedAt: {
        $lt: DAYS(30),
      },
    });

    logger.info(`Deleted ${warmupResult.deletedCount} completed warmups`);

    logger.success("Cleanup job completed successfully.");
  } catch (error) {
    logger.error("Cleanup job failed.", error);
  }
};

export default cleanupJob;
