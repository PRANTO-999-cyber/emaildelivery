// server/worker/src/processors/warmup.processor.js

import nodemailer from "nodemailer";

import SMTP from "../../../models/SMTP.js";
import Warmup from "../../../models/Warmup.js";

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
    smtp,
    transporter,
  };
};

export const processWarmup = async (job) => {
  const { warmupId, smtpId, recipient, subject, html, text } = job.data;

  logger.info(`Starting warmup job ${job.id}`);

  try {
    const { smtp, transporter } = await createTransport(smtpId);

    const info = await transporter.sendMail({
      from: `"Warmup" <${smtp.fromEmail}>`,
      to: recipient,
      subject,
      html,
      text,
    });

    await Warmup.findByIdAndUpdate(warmupId, {
      $inc: {
        totalSent: 1,
      },
      $set: {
        lastSentAt: new Date(),
        status: "running",
      },
    });

    await SMTP.findByIdAndUpdate(smtpId, {
      $inc: {
        warmupSent: 1,
      },
    });

    logger.success(`Warmup email sent to ${recipient}`);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    logger.error(`Warmup failed for ${recipient}`, error);

    await Warmup.findByIdAndUpdate(warmupId, {
      $inc: {
        failed: 1,
      },
      $set: {
        status: "failed",
        lastError: error.message,
      },
    });

    throw error;
  }
};

export default processWarmup;
