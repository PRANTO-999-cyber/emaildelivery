// server/routes/user.routes.js

import express from "express";
import * as userController from "../controllers/user.controller.js";
import auth from "../../middlewares/auth.js";

const router = express.Router();

router.get("/", auth, userController.getUsers);

router.get("/profile", auth, userController.getProfile);

router.put("/:id", auth, userController.updateUser);

router.delete("/:id", auth, userController.deleteUser);

export default router;
