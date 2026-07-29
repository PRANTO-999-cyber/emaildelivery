import crypto from "crypto";
import dns from "dns/promises";

import Domain from "../models/Domain.js";

/**
 * Generate verification token
 */
export const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

/**
 * Verify DNS TXT record
 */
export const verifyDomainDNS = async (domain, token) => {
  try {
    const records = await dns.resolveTxt(domain);

    const txtRecords = records.flat().join(" ");

    return txtRecords.includes(token);
  } catch (error) {
    return false;
  }
};

/**
 * Verify domain ownership
 */
export const verifyDomain = async (domainId) => {
  const domain = await Domain.findById(domainId);

  if (!domain) {
    throw new Error("Domain not found");
  }

  const verified = await verifyDomainDNS(
    domain.domain,
    domain.verificationToken,
  );

  if (verified) {
    domain.verified = true;
    domain.verifiedAt = new Date();
    await domain.save();
  }

  return domain;
};

/**
 * Create verification token for a domain
 */
export const createVerificationRecord = async (domainId) => {
  const domain = await Domain.findById(domainId);

  if (!domain) {
    throw new Error("Domain not found");
  }

  domain.verificationToken = generateVerificationToken();

  await domain.save();

  return {
    type: "TXT",
    host: `_verify.${domain.domain}`,
    value: domain.verificationToken,
  };
};

export default {
  generateVerificationToken,
  verifyDomainDNS,
  verifyDomain,
  createVerificationRecord,
};
