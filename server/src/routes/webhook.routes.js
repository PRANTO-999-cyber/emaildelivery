import { Router } from "express";
import { sendgridEventWebhook } from "../controllers/webhook.controller.js";

const router = Router();

router.post("/sendgrid", sendgridEventWebhook);

export default router;
