// server/worker/processors/email.processor.js

import nodemailer from "nodemailer";

import Campaign from "../../models/Campaign.js";
import SMTP from "../../models/SMTP.js";
import Tracking from "../../models/Tracking.js";

import logger from "../config/logger.js";

const createTransport = async (smtpId) => {
  const smtp = await SMTP.findById(smtpId);

  if (!smtp) {
    throw new Error("SMTP account not found.");
  }

  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: {
      user: smtp.username,
      pass: smtp.password,
    },
  });

  return {
    transporter,
    smtp,
  };
};

const updateCampaign = async (campaignId, field) => {
  await Campaign.findByIdAndUpdate(campaignId, {
    $inc: {
      [field]: 1,
    },
  });
};

export const processEmail = async (job) => {
  const {
    campaignId,
    smtpId,
    recipient,
    subject,
    html,
    text,
    from,
    metadata = {},
  } = job.data;

  logger.info(`Processing email job ${job.id}`);

  try {
    const { transporter, smtp } = await createTransport(smtpId);

    const info = await transporter.sendMail({
      from,
      to: recipient,
      subject,
      html,
      text,
    });

    await Tracking.create({
      campaign: campaignId,
      smtp: smtpId,
      email: recipient,
      event: "sent",
      messageId: info.messageId,
      metadata,
    });

    await updateCampaign(campaignId, "sent");

    await SMTP.findByIdAndUpdate(smtpId, {
      $inc: {
        totalSent: 1,
      },
    });

    logger.success(`Email sent to ${recipient}`);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    logger.error(`Email failed for ${recipient}`, error);

    await Tracking.create({
      campaign: campaignId,
      smtp: smtpId,
      email: recipient,
      event: "failed",
      reason: error.message,
      metadata,
    });

    await updateCampaign(campaignId, "failed");

    await SMTP.findByIdAndUpdate(smtpId, {
      $inc: {
        failed: 1,
      },
    });

    throw error;
  }
};

export default processEmail;
