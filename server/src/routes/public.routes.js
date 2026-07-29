import { Router } from "express";
import { unsubscribe } from "../controllers/public.controller.js";

const router = Router();

router.get("/unsubscribe/:token", unsubscribe);

export default router;
