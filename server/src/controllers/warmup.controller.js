import Warmup from "../models/Warmup.js";
import SMTP from "../models/SMTP.js";
import asyncHandler from "../middlewares/asyncHandler.js";

// ======================================
// CREATE WARMUP
// ======================================

export const createWarmup = asyncHandler(async (req, res) => {
  const { smtpId, domain, dailyLimit, increment, interval } = req.body;

  const smtp = await SMTP.findById(smtpId);

  if (!smtp) {
    return res.status(404).json({
      success: false,

      message: "SMTP account not found",
    });
  }

  const existing = await Warmup.findOne({
    smtp: smtpId,

    status: {
      $in: ["running", "pending"],
    },
  });

  if (existing) {
    return res.status(400).json({
      success: false,

      message: "Warmup already exists",
    });
  }

  const warmup = await Warmup.create({
    user: req.user.id,

    smtp: smtpId,

    domain,

    dailyLimit,

    currentLimit: 10,

    increment: increment || 10,

    interval: interval || "daily",

    status: "pending",

    emailsSent: 0,

    successRate: 100,
  });

  res.status(201).json({
    success: true,

    message: "Warmup created",

    warmup,
  });
});

// ======================================
// GET ALL WARMUPS
// ======================================

export const getWarmups = asyncHandler(async (req, res) => {
  const warmups = await Warmup.find({
    user: req.user.id,
  })
    .populate("smtp", "host email provider")
    .sort({
      createdAt: -1,
    });

  res.json({
    success: true,

    count: warmups.length,

    warmups,
  });
});

// ======================================
// GET SINGLE WARMUP
// ======================================

export const getWarmupById = asyncHandler(async (req, res) => {
  const warmup = await Warmup.findOne({
    _id: req.params.id,

    user: req.user.id,
  }).populate("smtp");

  if (!warmup) {
    return res.status(404).json({
      success: false,

      message: "Warmup not found",
    });
  }

  res.json({
    success: true,

    warmup,
  });
});

// ======================================
// UPDATE WARMUP
// ======================================

export const updateWarmup = asyncHandler(async (req, res) => {
  const warmup = await Warmup.findOne({
    _id: req.params.id,

    user: req.user.id,
  });

  if (!warmup) {
    return res.status(404).json({
      success: false,

      message: "Warmup not found",
    });
  }

  const fields = ["dailyLimit", "increment", "interval"];

  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      warmup[field] = req.body[field];
    }
  });

  await warmup.save();

  res.json({
    success: true,

    message: "Warmup updated",

    warmup,
  });
});

// ======================================
// START WARMUP
// ======================================

export const startWarmup = asyncHandler(async (req, res) => {
  const warmup = await Warmup.findOne({
    _id: req.params.id,

    user: req.user.id,
  });

  if (!warmup) {
    return res.status(404).json({
      success: false,

      message: "Warmup not found",
    });
  }

  warmup.status = "running";

  warmup.startDate = new Date();

  await warmup.save();

  res.json({
    success: true,

    message: "Warmup started",

    warmup,
  });
});

// ======================================
// STOP WARMUP
// ======================================

export const stopWarmup = asyncHandler(async (req, res) => {
  const warmup = await Warmup.findOne({
    _id: req.params.id,

    user: req.user.id,
  });

  if (!warmup) {
    return res.status(404).json({
      success: false,

      message: "Warmup not found",
    });
  }

  warmup.status = "paused";

  await warmup.save();

  res.json({
    success: true,

    message: "Warmup paused",
  });
});

// ======================================
// UPDATE WARMUP PROGRESS
// Used by queue worker
// ======================================

export const updateWarmupProgress = asyncHandler(async (req, res) => {
  const { sent, successRate } = req.body;

  const warmup = await Warmup.findById(req.params.id);

  if (!warmup) {
    return res.status(404).json({
      success: false,

      message: "Warmup not found",
    });
  }

  warmup.emailsSent += sent || 0;

  if (successRate) {
    warmup.successRate = successRate;
  }

  if (warmup.currentLimit < warmup.dailyLimit) {
    warmup.currentLimit += warmup.increment;
  }

  await warmup.save();

  res.json({
    success: true,

    warmup,
  });
});

// ======================================
// DELETE WARMUP
// ======================================

export const deleteWarmup = asyncHandler(async (req, res) => {
  const warmup = await Warmup.findOne({
    _id: req.params.id,

    user: req.user.id,
  });

  if (!warmup) {
    return res.status(404).json({
      success: false,

      message: "Warmup not found",
    });
  }

  await warmup.deleteOne();

  res.json({
    success: true,

    message: "Warmup deleted",
  });
});
