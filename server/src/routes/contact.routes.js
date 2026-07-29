import { Router } from "express";
import {
  createContact,
  getContacts,
  deleteContact,
  createGroup,
  getGroups,
} from "../controllers/contact.controller.js";
import { protect } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import {
  createContactSchema,
  createGroupSchema,
} from "../validators/contact.validator.js";

const router = Router();

router.use(protect);

router.post("/", validate(createContactSchema), createContact);
router.get("/", getContacts);
router.delete("/:id", deleteContact);

router.post("/groups", validate(createGroupSchema), createGroup);
router.get("/groups", getGroups);

export default router;
