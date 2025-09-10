import express from "express";
import { sessionMiddleware } from "../middleware"; // Unused for now
import * as todoController from "../controllers/todo.controllers";

const router = express.Router();

// GET /api/todos - fetch user's tasks
router.get("/", sessionMiddleware, todoController.getTasks);

// POST /api/todos - create a new task
router.post("/", sessionMiddleware, todoController.createTask);

// PUT /api/todos/:id - update a task
router.put("/:id", sessionMiddleware, todoController.updateTask);

export default router;
