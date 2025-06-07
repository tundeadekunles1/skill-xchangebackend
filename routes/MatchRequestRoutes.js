import express from "express";
import { approveMatchRequest } from "../controllers/MatchRequestController.js";
import { authenticate } from "../middlewares/AuthMiddlewares.js";

const router = express.Router();

router.put("/:id/approve", authenticate, approveMatchRequest);

export default router;
