import express from "express";
import { getSkillMatches } from "../controllers/UserControllers.js";
import {
  updateUserProfile,
  getCurrentUser,
  getAllTeachers,
} from "../controllers/UserControllers.js";
import { authenticate } from "../middlewares/AuthMiddlewares.js";
import upload from "../middlewares/multerMiddleware.js"; // for file uploads

const router = express.Router();
router.get("/me", authenticate, getCurrentUser);
router.patch(
  "/update-profile",
  authenticate,
  upload.single("profilePic"),
  updateUserProfile
);

router.get("/matches", authenticate, getSkillMatches);
router.get("/teachers", authenticate, getAllTeachers);

export default router;
