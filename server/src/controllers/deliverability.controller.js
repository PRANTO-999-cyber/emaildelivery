import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

import Domain from "../models/Domain.js";
import Campaign from "../models/Campaign.js";
import Bounce from "../models/Bounce.js";
import EmailLog from "../models/EmailLog.js";

import { runFullDeliverabilityCheck } from "../services/dnsCheck.service.js";

export const getDomainDeliverability = asyncHandler(async (req, res) => {
  const domain = await Domain.findById(req.params.id);
  if (!domain) throw new ApiError(404, "Domain not found");

  const report = await runFullDeliverabilityCheck(
    domain.domain,
    domain.dkim.selector || "s1",
  );

  res.status(200).json(
    new ApiResponse(200, {
      domain: domain.domain,
      reputationScore: domain.reputationScore,
      status: domain.status,
      report,
    }),
  );
});

export const listDomainDeliverability = asyncHandler(async (req, res) => {
  const domains = await Domain.find().sort({ reputationScore: 1, status: 1 });

  const summary = domains.map((d) => ({
    id: d._id,
    domain: d.domain,
    status: d.status,
    reputationScore: d.reputationScore,
    spf: d.spf.verified,
    dkim: d.dkim.verified,
    dmarc: d.dmarc.verified,
  }));

  res.status(200).json(new ApiResponse(200, summary));
});

export const getCampaignDeliverability = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id).select(
    "name stats status sentAt fromDomain",
  );
  if (!campaign) throw new ApiError(404, "Campaign not found");

  const {
    sent,
    delivered,
    opened,
    clicked,
    bounced,
    complained,
    unsubscribed,
  } = campaign.stats;

  const rates = {
    deliveryRate: sent > 0 ? Number(((delivered / sent) * 100).toFixed(2)) : 0,
    bounceRate: sent > 0 ? Number(((bounced / sent) * 100).toFixed(2)) : 0,
    complaintRate:
      sent > 0 ? Number(((complained / sent) * 100).toFixed(2)) : 0,
    openRate: sent > 0 ? Number(((opened / sent) * 100).toFixed(2)) : 0,
    clickRate: sent > 0 ? Number(((clicked / sent) * 100).toFixed(2)) : 0,
    unsubscribeRate:
      sent > 0 ? Number(((unsubscribed / sent) * 100).toFixed(2)) : 0,
  };

  const risk = [];
  if (rates.bounceRate > 2)
    risk.push(
      "Bounce rate is above the 2% threshold mailbox providers watch for.",
    );
  if (rates.complaintRate > 0.1)
    risk.push(
      "Spam complaint rate is above the 0.1% threshold mailbox providers watch for.",
    );
  if (rates.openRate < 10 && sent > 50)
    risk.push(
      "Open rate is low — low engagement can hurt future inbox placement.",
    );

  const recentBounces = await Bounce.find({ campaign: campaign._id })
    .sort({ createdAt: -1 })
    .limit(10);

  res.status(200).json(
    new ApiResponse(200, {
      campaign: {
        id: campaign._id,
        name: campaign.name,
        status: campaign.status,
        sentAt: campaign.sentAt,
      },
      stats: campaign.stats,
      rates,
      risk,
      recentBounces,
    }),
  );
});

export const getDeliverabilityLogs = asyncHandler(async (req, res) => {
  const { campaignId, status, page = 1, limit = 25 } = req.query;

  const filter = {};
  if (campaignId) filter.campaign = campaignId;
  if (status) filter.status = status;

  const logs = await EmailLog.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await EmailLog.countDocuments(filter);

  res
    .status(200)
    .json(
      new ApiResponse(200, {
        logs,
        total,
        page: Number(page),
        limit: Number(limit),
      }),
    );
});
