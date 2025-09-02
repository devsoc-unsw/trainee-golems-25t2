import express from "express";
import * as dashController from "../controllers/dash.controllers";
import { sessionMiddleware } from "../middleware";

const router = express.Router();

router.get("/summary", sessionMiddleware, dashController.summary);

export default router;
