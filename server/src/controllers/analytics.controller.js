// server/controllers/analytics.controller.js

import Campaign from "../models/Campaign.js";
import Tracking from "../models/Tracking.js";
import SMTP from "../models/SMTP.js";
import User from "../models/User.js";
import asyncHandler from "../middlewares/asyncHandler.js";
// ======================================
// GET DASHBOARD ANALYTICS
// ======================================

export const getDashboardAnalytics = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const totalCampaigns = await Campaign.countDocuments({
    user: userId,
  });

  const campaigns = await Campaign.find({
    user: userId,
  });

  let totalSent = 0;

  let totalDelivered = 0;

  let totalOpened = 0;

  let totalClicked = 0;

  let totalBounced = 0;

  campaigns.forEach((campaign) => {
    totalSent += campaign.sent || 0;

    totalDelivered += campaign.delivered || 0;

    totalOpened += campaign.opened || 0;

    totalClicked += campaign.clicked || 0;

    totalBounced += campaign.bounced || 0;
  });

  const deliveryRate = totalSent ? (totalDelivered / totalSent) * 100 : 0;

  const openRate = totalDelivered ? (totalOpened / totalDelivered) * 100 : 0;

  const clickRate = totalOpened ? (totalClicked / totalOpened) * 100 : 0;

  const bounceRate = totalSent ? (totalBounced / totalSent) * 100 : 0;

  res.json({
    success: true,

    analytics: {
      campaigns: totalCampaigns,

      emails: {
        sent: totalSent,

        delivered: totalDelivered,

        opened: totalOpened,

        clicked: totalClicked,

        bounced: totalBounced,
      },

      rates: {
        deliveryRate: `${deliveryRate.toFixed(2)}%`,

        openRate: `${openRate.toFixed(2)}%`,

        clickRate: `${clickRate.toFixed(2)}%`,

        bounceRate: `${bounceRate.toFixed(2)}%`,
      },
    },
  });
});

// ======================================
// CAMPAIGN PERFORMANCE ANALYTICS
// ======================================

export const getCampaignAnalytics = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findOne({
    _id: req.params.id,

    user: req.user.id,
  });

  if (!campaign) {
    return res.status(404).json({
      success: false,

      message: "Campaign not found",
    });
  }

  const deliveryRate = campaign.sent
    ? (campaign.delivered / campaign.sent) * 100
    : 0;

  const openRate = campaign.delivered
    ? (campaign.opened / campaign.delivered) * 100
    : 0;

  const clickRate = campaign.opened
    ? (campaign.clicked / campaign.opened) * 100
    : 0;

  res.json({
    success: true,

    analytics: {
      campaign: {
        id: campaign._id,

        name: campaign.name,

        status: campaign.status,
      },

      metrics: {
        sent: campaign.sent,

        delivered: campaign.delivered,

        opened: campaign.opened,

        clicked: campaign.clicked,

        bounced: campaign.bounced,
      },

      rates: {
        delivery: `${deliveryRate.toFixed(2)}%`,

        open: `${openRate.toFixed(2)}%`,

        click: `${clickRate.toFixed(2)}%`,
      },
    },
  });
});

// ======================================
// TRACKING ANALYTICS
// ======================================

export const getTrackingAnalytics = asyncHandler(async (req, res) => {
  const userCampaigns = await Campaign.find({
    user: req.user.id,
  }).select("_id");

  const campaignIds = userCampaigns.map((item) => item._id);

  const tracking = await Tracking.aggregate([
    {
      $match: {
        campaign: {
          $in: campaignIds,
        },
      },
    },

    {
      $group: {
        _id: "$event",

        total: {
          $sum: 1,
        },
      },
    },
  ]);

  res.json({
    success: true,

    tracking,
  });
});

// ======================================
// SMTP PERFORMANCE ANALYTICS
// ======================================

export const getSMTPAnalytics = asyncHandler(async (req, res) => {
  const smtpAccounts = await SMTP.find({
    user: req.user.id,
  });

  const data = smtpAccounts.map((smtp) => ({
    smtp: smtp.host,

    provider: smtp.provider,

    status: smtp.status,

    sent: smtp.totalSent || 0,

    failed: smtp.failed || 0,

    reputation: smtp.reputation || 0,
  }));

  res.json({
    success: true,

    smtp: data,
  });
});

// ======================================
// USER USAGE ANALYTICS
// ======================================

export const getUsageAnalytics = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select(
    "plan emailQuota emailsSent",
  );

  res.json({
    success: true,

    usage: {
      plan: user.plan,

      quota: user.emailQuota,

      used: user.emailsSent,

      remaining: user.emailQuota - user.emailsSent,
    },
  });
});

// ======================================
// ADMIN PLATFORM ANALYTICS
// ======================================

export const getAdminAnalytics = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();

  const totalCampaigns = await Campaign.countDocuments();

  const totalEmails = await Campaign.aggregate([
    {
      $group: {
        _id: null,

        sent: {
          $sum: "$sent",
        },

        delivered: {
          $sum: "$delivered",
        },
      },
    },
  ]);

  res.json({
    success: true,

    analytics: {
      users: totalUsers,

      campaigns: totalCampaigns,

      emails: totalEmails[0] || {
        sent: 0,

        delivered: 0,
      },
    },
  });
});
