import { Router } from "express";
import {
  createTemplate,
  getTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate,
} from "../controllers/template.controller.js";
import { protect } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import {
  createTemplateSchema,
  updateTemplateSchema,
} from "../validators/template.validator.js";

const router = Router();

router.use(protect);

router.post("/", validate(createTemplateSchema), createTemplate);
router.get("/", getTemplates);
router.get("/:id", getTemplateById);
router.patch("/:id", validate(updateTemplateSchema), updateTemplate);
router.delete("/:id", deleteTemplate);

export default router;
