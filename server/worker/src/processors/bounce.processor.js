/**
 * @file bounce.processor.js
 * @description Background Queue Processor for Async Bounce & Telemetry Events.
 * Evaluates bounce severity (hard vs soft), updates suppression lists, and monitors tenant circuit breakers.
 */

const { Contact } = require("../models/contact.model");
const { Campaign } = require("../models/campaign.model");
const { Suppression } = require("../models/suppression.model");
const { TenantMetrics } = require("../models/tenantMetrics.model");
const logger = require("../utils/logger");

// Circuit breaker threshold: 5% bounce rate on active dispatches
const BOUNCE_CIRCUIT_BREAKER_THRESHOLD = 0.05;

/**
 * Normalizes vendor-specific bounce codes into system standards.
 * @param {string|number} rawCode - Raw SMTP or provider status code
 * @returns {'HARD'|'SOFT'|'COMPLAINT'} Normalized bounce type
 */
function classifyBounceType(rawCode) {
  const codeStr = String(rawCode);

  // 5xx codes or explicit hard-bounce indicators
  if (
    codeStr.startsWith("5") ||
    codeStr.includes("550") ||
    codeStr.includes("user_unknown")
  ) {
    return "HARD";
  }

  // Spam complaint feedback loop signals
  if (
    codeStr.includes("spam") ||
    codeStr.includes("abuse") ||
    codeStr.includes("complaint")
  ) {
    return "COMPLAINT";
  }

  // Temporary failure / 4xx codes
  return "SOFT";
}

/**
 * Primary BullMQ job processing function for bounce events.
 *
 * @param {Object} job - BullMQ Job Object
 * @param {Object} job.data - Ingested webhook event payload
 * @param {string} job.data.tenantId - Multi-tenant workspace ID
 * @param {string} job.data.campaignId - Dispatched campaign ID
 * @param {string} job.data.email - Target recipient email address
 * @param {string|number} job.data.bounceCode - SMTP or provider status code
 * @param {string} job.data.reason - Raw failure reason string
 * @param {string} job.data.provider - ESP provider name (e.g., 'ses', 'mailgun')
 */
async function processBounceJob(job) {
  const { tenantId, campaignId, email, bounceCode, reason, provider } =
    job.data;

  logger.info(
    `[Bounce Processor] Processing event for email: ${email} (Tenant: ${tenantId})`,
  );

  const bounceCategory = classifyBounceType(bounceCode);

  try {
    // 1. Log or update suppression list for Hard Bounces and Complaints
    if (bounceCategory === "HARD" || bounceCategory === "COMPLAINT") {
      await Suppression.updateOne(
        { tenantId, email: email.toLowerCase() },
        {
          $set: {
            tenantId,
            email: email.toLowerCase(),
            reason:
              reason || `Permanent deliverability failure (${bounceCategory})`,
            type: bounceCategory,
            provider,
            sourceCampaignId: campaignId,
            updatedAt: new Date(),
          },
        },
        { upsert: true },
      );

      // Flag contact status as unsubscribed/bounced in the primary database
      await Contact.updateOne(
        { tenantId, email: email.toLowerCase() },
        {
          $set: {
            status: bounceCategory === "COMPLAINT" ? "complained" : "bounced",
            deliverabilityState: "undeliverable",
            updatedAt: new Date(),
          },
        },
      );

      logger.warn(
        `[Bounce Processor] Added ${email} to suppression list. Reason: ${bounceCategory}`,
      );
    }

    // 2. Increment campaign-level stats & recalculate ratios
    if (campaignId) {
      const campaign = await Campaign.findById(campaignId);
      if (campaign) {
        if (bounceCategory === "HARD") campaign.stats.hardBounces += 1;
        if (bounceCategory === "SOFT") campaign.stats.softBounces += 1;
        if (bounceCategory === "COMPLAINT") campaign.stats.complaints += 1;

        const totalBounces =
          campaign.stats.hardBounces + campaign.stats.softBounces;
        const totalSent = campaign.stats.sent || 1;
        const bounceRate = totalBounces / totalSent;

        // 3. Circuit Breaker Check: Pause campaign if bounce threshold exceeded
        if (
          bounceRate > BOUNCE_CIRCUIT_BREAKER_THRESHOLD &&
          campaign.status === "dispatching"
        ) {
          campaign.status = "paused_circuit_breaker";
          campaign.circuitBreakerReason = `Hard bounce rate reached ${(bounceRate * 100).toFixed(2)}% (Threshold: ${BOUNCE_CIRCUIT_BREAKER_THRESHOLD * 100}%)`;

          logger.error(
            `[Circuit Breaker Triggered] Campaign ${campaignId} paused automatically. High bounce rate detected.`,
          );
        }

        await campaign.save();
      }
    }

    // 4. Update rolling 24h telemetry metrics for the tenant
    await TenantMetrics.updateOne(
      { tenantId },
      {
        $inc: {
          totalBounces: 1,
          ...(bounceCategory === "HARD" ? { hardBounces: 1 } : {}),
          ...(bounceCategory === "COMPLAINT" ? { complaints: 1 } : {}),
        },
      },
      { upsert: true },
    );

    return { success: true, email, bounceCategory };
  } catch (error) {
    logger.error(
      `[Bounce Processor Error] Failed processing job ${job.id}:`,
      error,
    );
    throw error; // Re-throw to allow BullMQ auto-retry
  }
}

module.exports = {
  processBounceJob,
  classifyBounceType,
};
