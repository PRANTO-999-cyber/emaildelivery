// server/worker/processors/analytics.processor.js

import Campaign from "../../models/Campaign.js";
import Tracking from "../../models/Tracking.js";
import User from "../../models/User.js";
import logger from "../config/logger.js";

const incrementCampaignStat = async (campaignId, field) => {
  await Campaign.findByIdAndUpdate(
    campaignId,
    {
      $inc: {
        [field]: 1,
      },
    },
    {
      new: true,
    },
  );
};

export const processAnalytics = async (job) => {
  const { campaignId, userId, email, event, metadata = {} } = job.data;

  try {
    logger.info(`Processing analytics event: ${event}`);

    await Tracking.create({
      campaign: campaignId,
      user: userId,
      email,
      event,
      metadata,
      createdAt: new Date(),
    });

    switch (event) {
      case "sent":
        await incrementCampaignStat(campaignId, "sent");
        break;

      case "delivered":
        await incrementCampaignStat(campaignId, "delivered");
        break;

      case "opened":
        await incrementCampaignStat(campaignId, "opened");
        break;

      case "clicked":
        await incrementCampaignStat(campaignId, "clicked");
        break;

      case "bounced":
        await incrementCampaignStat(campaignId, "bounced");
        break;

      case "failed":
        await incrementCampaignStat(campaignId, "failed");
        break;

      case "spam":
        await incrementCampaignStat(campaignId, "spam");
        break;

      case "unsubscribed":
        await incrementCampaignStat(campaignId, "unsubscribed");
        break;

      default:
        logger.warn(`Unknown analytics event: ${event}`);
    }

    if (userId && event === "sent") {
      await User.findByIdAndUpdate(userId, {
        $inc: {
          emailsSent: 1,
        },
      });
    }

    logger.success(`Analytics processed for campaign ${campaignId}`);

    return {
      success: true,
    };
  } catch (error) {
    logger.error("Analytics processor failed.", error);

    throw error;
  }
};

export default processAnalytics;
