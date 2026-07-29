import Queue from "../models/Queue.js";
import Campaign from "../models/Campaign.js";

// ===========================================
// Create Queue Job
// ===========================================

export const createQueueJob = async (data) => {
  return await Queue.create(data);
};

// ===========================================
// Queue Campaign Emails
// ===========================================

export const enqueueCampaignEmails = async (campaign) => {
  if (!campaign) {
    throw new Error("Campaign is required.");
  }

  const jobs = [];

  const recipients = campaign.recipients || [];

  for (const recipient of recipients) {
    jobs.push({
      campaign: campaign._id,
      tenant: campaign.tenant,
      recipient,
      status: "pending",
      priority: campaign.priority || 0,
      scheduledAt: campaign.scheduledAt || new Date(),
    });
  }

  if (jobs.length > 0) {
    await Queue.insertMany(jobs);
  }

  return jobs.length;
};

// ===========================================
// Retry Queue Job
// ===========================================

export const retryQueueJob = async (jobId) => {
  return await Queue.findByIdAndUpdate(
    jobId,
    {
      status: "pending",
      error: null,
      processedAt: null,
    },
    { new: true },
  );
};

// ===========================================
// Cancel Queue Job
// ===========================================

export const cancelQueueJob = async (jobId) => {
  return await Queue.findByIdAndUpdate(
    jobId,
    {
      status: "cancelled",
    },
    { new: true },
  );
};

// ===========================================
// Queue Statistics
// ===========================================

export const getQueueStats = async () => {
  const pending = await Queue.countDocuments({ status: "pending" });
  const processing = await Queue.countDocuments({ status: "processing" });
  const completed = await Queue.countDocuments({ status: "completed" });
  const failed = await Queue.countDocuments({ status: "failed" });

  return {
    pending,
    processing,
    completed,
    failed,
  };
};

export default {
  createQueueJob,
  enqueueCampaignEmails,
  retryQueueJob,
  cancelQueueJob,
  getQueueStats,
};
