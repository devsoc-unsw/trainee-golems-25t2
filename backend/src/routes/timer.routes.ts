import express from "express";
import * as timerController from "../controllers/timer.controllers";
import { sessionMiddleware } from "../middleware";

const router = express.Router();

// POST /api/timer - Create a new study session
router.post("/", sessionMiddleware, timerController.createStudySession);

// GET /api/timer/stats - Get study statistics
router.get("/stats", sessionMiddleware, timerController.getStudyStats);

export default router;
