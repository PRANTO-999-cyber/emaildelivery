import { Router } from "express";
import {
  getDomainDeliverability,
  listDomainDeliverability,
  getCampaignDeliverability,
  getDeliverabilityLogs,
} from "../controllers/deliverability.controller.js";
import { protect } from "../middlewares/auth.js";

const router = Router();

router.use(protect);

router.get("/domains", listDomainDeliverability);
router.get("/domains/:id", getDomainDeliverability);
router.get("/campaigns/:id", getCampaignDeliverability);
router.get("/logs", getDeliverabilityLogs);

export default router;
