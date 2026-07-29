import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import Campaign from "../models/Campaign.js";
import Contact from "../models/Contact.js";
import { enqueueCampaignEmails } from "../services/queue.service.js";
import { env } from "../config/env.js";

export const createCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.create({
    ...req.body,
    createdBy: req.user._id,
  });
  res.status(201).json(new ApiResponse(201, campaign, "Campaign created"));
});

export const getCampaigns = asyncHandler(async (req, res) => {
  const campaigns = await Campaign.find()
    .sort({ createdAt: -1 })
    .populate("fromDomain", "domain status");
  res.status(200).json(new ApiResponse(200, campaigns));
});

export const getCampaignById = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id).populate(
    "fromDomain groups",
  );
  if (!campaign) throw new ApiError(404, "Campaign not found");
  res.status(200).json(new ApiResponse(200, campaign));
});

export const updateCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findOneAndUpdate(
    { _id: req.params.id, status: "draft" },
    req.body,
    {
      new: true,
    },
  );
  if (!campaign)
    throw new ApiError(404, "Campaign not found or is not editable");
  res.status(200).json(new ApiResponse(200, campaign, "Campaign updated"));
});

export const sendCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id).populate(
    "fromDomain",
  );
  if (!campaign) throw new ApiError(404, "Campaign not found");
  if (campaign.status !== "draft")
    throw new ApiError(400, "Only draft campaigns can be sent");

  const domain = campaign.fromDomain;
  if (!domain || domain.status !== "verified") {
    throw new ApiError(
      400,
      "Sending domain is not verified (SPF/DKIM/DMARC). Verify the domain before sending to protect inbox placement.",
    );
  }

  const contacts = await Contact.find({
    groups: { $in: campaign.groups },
    status: "subscribed",
    "consent.given": true,
  });

  if (!contacts.length) {
    throw new ApiError(
      400,
      "No consented, subscribed contacts found in the selected groups",
    );
  }

  const queuedCount = await enqueueCampaignEmails(
    campaign,
    contacts,
    `${env.appBaseUrl}/api/v1/public/unsubscribe`,
  );

  campaign.status = "sending";
  campaign.stats.totalRecipients = queuedCount;
  await campaign.save();

  res
    .status(200)
    .json(new ApiResponse(200, { queuedCount }, "Campaign queued for sending"));
});

export const deleteCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findOneAndDelete({
    _id: req.params.id,
    status: "draft",
  });
  if (!campaign)
    throw new ApiError(
      404,
      "Campaign not found or cannot be deleted once sent",
    );
  res.status(200).json(new ApiResponse(200, null, "Campaign deleted"));
});
