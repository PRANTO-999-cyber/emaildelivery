import { Router } from "express";
import {
  createDomain,
  getDomains,
  verifyDomain,
  setDefaultDomain,
} from "../controllers/domain.controller.js";
import { protect, restrictTo } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { createDomainSchema } from "../validators/domain.validator.js";

const router = Router();

router.use(protect);

router.post(
  "/",
  restrictTo("owner", "admin"),
  validate(createDomainSchema),
  createDomain,
);
router.get("/", getDomains);
router.post("/:id/verify", restrictTo("owner", "admin"), verifyDomain);
router.patch(
  "/:id/set-default",
  restrictTo("owner", "admin"),
  setDefaultDomain,
);

export default router;
