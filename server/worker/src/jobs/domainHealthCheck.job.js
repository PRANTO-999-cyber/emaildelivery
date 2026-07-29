// server/worker/jobs/domainHealthCheck.job.js

import dns from "node:dns/promises";
import Domain from "../../models/Domain.js";
import logger from "../config/logger.js";

const hasSPF = (records = []) =>
  records.some((record) => record.startsWith("v=spf1"));

const hasDMARC = async (domain) => {
  try {
    const records = await dns.resolveTxt(`_dmarc.${domain}`);

    return records.flat().some((record) => record.startsWith("v=DMARC1"));
  } catch {
    return false;
  }
};

const hasDKIM = async (domain) => {
  try {
    // Default selector.
    // Store selector in DB if different.
    const selector = "default";

    const records = await dns.resolveTxt(`${selector}._domainkey.${domain}`);

    return records.length > 0;
  } catch {
    return false;
  }
};

const checkMX = async (domain) => {
  try {
    const records = await dns.resolveMx(domain);

    return records.length > 0;
  } catch {
    return false;
  }
};

export const domainHealthCheckJob = async () => {
  logger.info("Starting domain health check...");

  try {
    const domains = await Domain.find();

    for (const domain of domains) {
      let score = 0;

      let spf = false;
      let dkim = false;
      let dmarc = false;
      let mx = false;

      try {
        const txt = await dns.resolveTxt(domain.name);

        spf = hasSPF(txt.flat());

        if (spf) score += 25;
      } catch {}

      dkim = await hasDKIM(domain.name);

      if (dkim) score += 25;

      dmarc = await hasDMARC(domain.name);

      if (dmarc) score += 25;

      mx = await checkMX(domain.name);

      if (mx) score += 25;

      domain.spf = spf;
      domain.dkim = dkim;
      domain.dmarc = dmarc;
      domain.mx = mx;

      domain.healthScore = score;

      domain.status =
        score >= 75 ? "healthy" : score >= 50 ? "warning" : "critical";

      domain.lastCheckedAt = new Date();

      await domain.save();

      logger.info(`${domain.name} → ${domain.status} (${score}%)`);
    }

    logger.success("Domain health check completed.");
  } catch (error) {
    logger.error("Domain health check failed.", error);
  }
};

export default domainHealthCheckJob;
