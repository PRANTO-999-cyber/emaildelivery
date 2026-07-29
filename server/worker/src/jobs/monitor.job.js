// server/worker/jobs/monitor.job.js

import mongoose from "mongoose";
import { Queue } from "bullmq";

import redis from "../config/redis.js";
import logger from "../config/logger.js";

import SMTP from "../../models/SMTP.js";
import Campaign from "../../models/Campaign.js";
import Domain from "../../models/Domain.js";

const emailQueue = new Queue("email-queue", {
  connection: redis,
});

const warmupQueue = new Queue("warmup-queue", {
  connection: redis,
});

const checkRedis = async () => {
  try {
    await redis.ping();

    return {
      status: "healthy",
    };
  } catch {
    return {
      status: "down",
    };
  }
};

const checkMongo = () => {
  return {
    status: mongoose.connection.readyState === 1 ? "healthy" : "down",
  };
};

const checkQueues = async () => {
  const waiting = await emailQueue.getWaitingCount();
  const active = await emailQueue.getActiveCount();
  const failed = await emailQueue.getFailedCount();

  const warmupWaiting = await warmupQueue.getWaitingCount();

  return {
    email: {
      waiting,
      active,
      failed,
    },
    warmup: {
      waiting: warmupWaiting,
    },
  };
};

const checkSMTP = async () => {
  const total = await SMTP.countDocuments();

  const active = await SMTP.countDocuments({
    status: "active",
  });

  const inactive = total - active;

  return {
    total,
    active,
    inactive,
  };
};

const checkCampaigns = async () => {
  const failed = await Campaign.countDocuments({
    status: "failed",
  });

  const sending = await Campaign.countDocuments({
    status: "sending",
  });

  const scheduled = await Campaign.countDocuments({
    status: "scheduled",
  });

  return {
    failed,
    sending,
    scheduled,
  };
};

const checkDomains = async () => {
  const healthy = await Domain.countDocuments({
    status: "healthy",
  });

  const warning = await Domain.countDocuments({
    status: "warning",
  });

  const critical = await Domain.countDocuments({
    status: "critical",
  });

  return {
    healthy,
    warning,
    critical,
  };
};

export const monitorJob = async () => {
  logger.info("Running system monitor...");

  try {
    const redisStatus = await checkRedis();
    const mongoStatus = checkMongo();
    const queues = await checkQueues();
    const smtp = await checkSMTP();
    const campaigns = await checkCampaigns();
    const domains = await checkDomains();

    logger.info("========== SYSTEM STATUS ==========");

    logger.info(`Redis: ${redisStatus.status}`);

    logger.info(`MongoDB: ${mongoStatus.status}`);

    logger.info(
      `Email Queue -> Waiting:${queues.email.waiting}, Active:${queues.email.active}, Failed:${queues.email.failed}`,
    );

    logger.info(`Warmup Queue -> Waiting:${queues.warmup.waiting}`);

    logger.info(`SMTP -> Active:${smtp.active}/${smtp.total}`);

    logger.info(
      `Campaigns -> Sending:${campaigns.sending}, Scheduled:${campaigns.scheduled}, Failed:${campaigns.failed}`,
    );

    logger.info(
      `Domains -> Healthy:${domains.healthy}, Warning:${domains.warning}, Critical:${domains.critical}`,
    );

    if (queues.email.failed > 100) {
      logger.warn("Large number of failed email jobs detected.");
    }

    if (campaigns.failed > 10) {
      logger.warn("Multiple campaigns have failed.");
    }

    if (domains.critical > 0) {
      logger.warn(`${domains.critical} domains require attention.`);
    }

    logger.success("System monitor completed.");
  } catch (error) {
    logger.error("System monitor failed.", error);
  }
};

export default monitorJob;
