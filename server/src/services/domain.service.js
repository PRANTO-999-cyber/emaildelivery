import Domain from "../models/Domain.js";
import { runFullDeliverabilityCheck } from "./dnsCheck.service.js";
import { ApiError } from "../utils/ApiError.js";

export const addDomain = async ({ domain, userId }) => {
  const existing = await Domain.findOne({ name: domain });
  if (existing) {
    throw new ApiError(409, "This domain has already been added");
  }

  const created = await Domain.create({
    user: userId,
    name: domain,
  });

  return created;
};

export const listDomains = async () =>
  Domain.find({ isDeleted: { $ne: true } }).sort({ createdAt: -1 });

export const verifyDomain = async (domainId) => {
  const domainDoc = await Domain.findById(domainId);
  if (!domainDoc) {
    throw new ApiError(404, "Domain not found");
  }

  const report = await runFullDeliverabilityCheck(domainDoc.name, "s1");

  domainDoc.spfVerified = report.spf.valid;
  domainDoc.dkimVerified = report.dkim.valid;
  domainDoc.dmarcVerified = report.dmarc.valid;
  domainDoc.mxVerified = report.mx.length > 0;

  const fullyVerified = domainDoc.isVerified();
  domainDoc.verificationStatus = fullyVerified ? "verified" : "pending";
  if (fullyVerified && !domainDoc.verifiedAt) {
    domainDoc.verifiedAt = new Date();
  }

  await domainDoc.save();

  return { domain: domainDoc, report };
};

export const setDefaultDomain = async (domainId) => {
  await Domain.updateMany({}, { $set: { sendingEnabled: false } });
  const domainDoc = await Domain.findByIdAndUpdate(
    domainId,
    { sendingEnabled: true, status: "active" },
    { new: true },
  );
  if (!domainDoc) throw new ApiError(404, "Domain not found");
  return domainDoc;
};
