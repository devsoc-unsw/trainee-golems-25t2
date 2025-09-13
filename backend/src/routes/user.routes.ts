import express from "express";
import * as userController from "../controllers/user.controllers";
import { sessionMiddleware } from "../middleware"; // Unused for now

const router = express.Router();

// Get user profile
router.get("/profile", sessionMiddleware, userController.profile);

// Upsert user from Clerk signup
router.post("/clerk", userController.upsertClerk);

export default router;
