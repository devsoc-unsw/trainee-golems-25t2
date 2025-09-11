import express from "express";
import * as timerController from "../controllers/timer.controllers";
import { sessionMiddleware } from "../middleware";

const router = express.Router();

// POST /api/timer - Create a new study session
router.post("/", sessionMiddleware, timerController.createStudySession);

export default router;
