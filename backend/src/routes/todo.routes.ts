import express from "express";
import { sessionMiddleware } from "../middleware"; // Unused for now
import * as todoController from "../controllers/todo.controllers";

const router = express.Router();

// GET /api/todos - fetch user's tasks
router.get("/", sessionMiddleware, todoController.getTasks);

export default router;
