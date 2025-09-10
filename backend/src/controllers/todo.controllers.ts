import { Request, Response } from "express";
import * as todoService from "../services/todo.service";
import { ErrorMap, StatusCodeMap } from "../constants/errors";
import { getUserBySession } from "../services/auth.service";

export async function getTasks(req: Request, res: Response) {
    try {
        const session = req.cookies.sessionId;
        const userId = await getUserBySession(session);
        if (!userId) {
            return res.status(400).json({ error: ErrorMap.USER_DOES_NOT_EXIST });
        }
        const tasks = await todoService.getTasks(userId.id);
        res.json(tasks);
    } catch (err: any) {
        const message = err instanceof Error ? err.message : "An error occurred";
        const statusCode = StatusCodeMap[message] || 500;
        res.status(statusCode).json({ error: message });
    }
};

export async function createTask(req: Request, res: Response) {
    try {
        const session = req.cookies.sessionId;
        const userId = await getUserBySession(session);
        if (!userId) {
            return res.status(400).json({ error: ErrorMap.USER_DOES_NOT_EXIST });
        }
        const { title, description } = req.body;
        if (!title) {
            return res.status(400).json({ error: ErrorMap.MISSING_FIELDS });
        }
        if (title.length > 100) {
            return res.status(400).json({ error: ErrorMap.TASK_NAME_TOO_LONG });
        }
        if (description && description.length > 500) {
            return res.status(400).json({ error: ErrorMap.TASK_DESCRIPTION_TOO_LONG });
        }
        const newTask = await todoService.createTask(userId.id, title, description);
        res.json(newTask);
    } catch (err: any) {
        const message = err instanceof Error ? err.message : "An error occurred";
        const statusCode = StatusCodeMap[message] || 500;
        res.status(statusCode).json({ error: message });
    }
};