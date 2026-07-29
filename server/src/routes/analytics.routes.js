import express from "express";

import {
  getDashboardAnalytics,
  getCampaignAnalytics,
  getTrackingAnalytics,
  getSMTPAnalytics,
  getUsageAnalytics,
  getAdminAnalytics,
} from "../controllers/analytics.controller.js";

import { protect, restrictTo } from "../middlewares/auth.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

router.get("/dashboard", protect, getDashboardAnalytics);

router.get("/overview", protect, getDashboardAnalytics);

/*
|--------------------------------------------------------------------------
| Campaign Analytics
|--------------------------------------------------------------------------
*/

router.get("/campaigns", protect, getCampaignAnalytics);

router.get("/campaigns/:campaignId", protect, getCampaignAnalytics);

/*
|--------------------------------------------------------------------------
| Tracking Analytics
|--------------------------------------------------------------------------
*/

router.get("/tracking", protect, getTrackingAnalytics);

/*
|--------------------------------------------------------------------------
| SMTP Analytics
|--------------------------------------------------------------------------
*/

router.get("/smtp", protect, getSMTPAnalytics);

/*
|--------------------------------------------------------------------------
| Usage Analytics
|--------------------------------------------------------------------------
*/

router.get("/usage", protect, getUsageAnalytics);

/*
|--------------------------------------------------------------------------
| Admin Analytics
|--------------------------------------------------------------------------
*/

router.get("/admin", protect, restrictTo("admin"), getAdminAnalytics);

export default router;
