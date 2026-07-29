// server/src/api/analytics.api.js

import express from "express";

import {
  getDashboardAnalytics,
  getCampaignAnalytics,
  getEmailAnalytics,
  getDomainAnalytics,
  getSMTPAnalytics,
} from "../controllers/analytics.controller.js";

import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * Dashboard Analytics
 */
router.get("/dashboard", protect, getDashboardAnalytics);

/**
 * Campaign Analytics
 */
router.get("/campaigns/:campaignId", protect, getCampaignAnalytics);

/**
 * Email Analytics
 */
router.get("/emails", protect, getEmailAnalytics);

/**
 * Domain Analytics
 */
router.get("/domains", protect, authorize("admin"), getDomainAnalytics);

/**
 * SMTP Analytics
 */
router.get("/smtp", protect, authorize("admin"), getSMTPAnalytics);

export default router;
