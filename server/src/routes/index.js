import { Router } from "express";
import authRoutes from "./auth.routes.js";
import domainRoutes from "./domain.routes.js";
import contactRoutes from "./contact.routes.js";
import campaignRoutes from "./campaign.routes.js";
import templateRoutes from "./template.routes.js";
import analyticsRoutes from "./analytics.routes.js";
import deliverabilityRoutes from "./deliverability.routes.js";
import webhookRoutes from "./webhook.routes.js";
import publicRoutes from "./public.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/domains", domainRoutes);
router.use("/contacts", contactRoutes);
router.use("/campaigns", campaignRoutes);
router.use("/templates", templateRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/deliverability", deliverabilityRoutes);
router.use("/webhooks", webhookRoutes);
router.use("/public", publicRoutes);

export default router;
