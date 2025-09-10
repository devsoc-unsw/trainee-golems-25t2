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