import { Router } from "express";
import {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  sendCampaign,
  deleteCampaign,
} from "../controllers/campaign.controller.js";
import { protect } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import {
  createCampaignSchema,
  updateCampaignSchema,
} from "../validators/campaign.validator.js";

const router = Router();

router.use(protect);

router.post("/", validate(createCampaignSchema), createCampaign);
router.get("/", getCampaigns);
router.get("/:id", getCampaignById);
router.patch("/:id", validate(updateCampaignSchema), updateCampaign);
router.post("/:id/send", sendCampaign);
router.delete("/:id", deleteCampaign);

export default router;
