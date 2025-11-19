import express from "express";
import {
  login,
  register,
  getCurrentUser,
  updateProfile,
} from "../controllers/auth.controller.js";

import { checkAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/current-user", checkAuth, getCurrentUser);
router.put("/update-profile", checkAuth, updateProfile);

export default router;
