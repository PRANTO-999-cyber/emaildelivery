import SMTP from "../models/SMTP.js";

/**
 * Reset counters if needed
 */
const resetCounters = async (smtp) => {
  const now = new Date();

  const currentDay = now.toISOString().slice(0, 10);
  const currentHour = `${currentDay}-${now.getHours()}`;

  if (smtp.lastDay !== currentDay) {
    smtp.dailyUsed = 0;
    smtp.lastDay = currentDay;
  }

  if (smtp.lastHour !== currentHour) {
    smtp.hourlyUsed = 0;
    smtp.lastHour = currentHour;
  }

  return smtp;
};

/**
 * Check whether SMTP can send another email
 */
export const canSend = async (smtpId) => {
  const smtp = await SMTP.findById(smtpId);

  if (!smtp) {
    throw new Error("SMTP account not found.");
  }

  await resetCounters(smtp);

  if (!smtp.isActive) {
    return {
      allowed: false,
      reason: "SMTP account is disabled.",
    };
  }

  if (smtp.dailyUsed >= smtp.dailyLimit) {
    return {
      allowed: false,
      reason: "Daily sending limit reached.",
    };
  }

  if (smtp.hourlyUsed >= smtp.hourlyLimit) {
    return {
      allowed: false,
      reason: "Hourly sending limit reached.",
    };
  }

  return {
    allowed: true,
    smtp,
  };
};

/**
 * Increment counters after a successful send
 */
export const incrementUsage = async (smtpId) => {
  const smtp = await SMTP.findById(smtpId);

  if (!smtp) {
    throw new Error("SMTP account not found.");
  }

  await resetCounters(smtp);

  smtp.dailyUsed += 1;
  smtp.hourlyUsed += 1;
  smtp.totalSent += 1;

  await smtp.save();

  return smtp;
};

/**
 * Get usage statistics
 */
export const getUsage = async (smtpId) => {
  const smtp = await SMTP.findById(smtpId);

  if (!smtp) {
    throw new Error("SMTP account not found.");
  }

  await resetCounters(smtp);

  return {
    smtpId: smtp._id,
    dailyLimit: smtp.dailyLimit,
    hourlyLimit: smtp.hourlyLimit,
    dailyUsed: smtp.dailyUsed,
    hourlyUsed: smtp.hourlyUsed,
    totalSent: smtp.totalSent,
    remainingToday: smtp.dailyLimit - smtp.dailyUsed,
    remainingHour: smtp.hourlyLimit - smtp.hourlyUsed,
  };
};

/**
 * Reset usage manually
 */
export const resetUsage = async (smtpId) => {
  const smtp = await SMTP.findById(smtpId);

  if (!smtp) {
    throw new Error("SMTP account not found.");
  }

  smtp.dailyUsed = 0;
  smtp.hourlyUsed = 0;
  smtp.lastDay = new Date().toISOString().slice(0, 10);

  smtp.lastHour = `${smtp.lastDay}-${new Date().getHours()}`;

  await smtp.save();

  return smtp;
};
