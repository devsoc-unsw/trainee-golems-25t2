import { Request, Response } from "express";
import * as timerService from "../services/timer.service";
import { ErrorMap, StatusCodeMap } from "../constants/errors";
import { getUserBySession } from "../services/auth.service";

export const createStudySession = async (req: Request, res: Response) => {
    try {
        const session = req.cookies.sessionId;
        const userId = await getUserBySession(session);
        if (!userId) {
            return res.status(400).json({ error: ErrorMap.USER_DOES_NOT_EXIST });
        }
        const { startTime, endTime } = req.body;
        await timerService.createStudySession(userId.id, startTime, endTime);
        res.json({ message: "Study session created successfully." });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "An error occurred";
        const statusCode = StatusCodeMap[message] || 500;
        res.status(statusCode).json({ error: message });
    }
};

export const getStudyStats = async (req: Request, res: Response) => {
    try {
        const session = req.cookies.sessionId;
        const userId = await getUserBySession(session);
        if (!userId) {
            return res.status(400).json({ error: ErrorMap.USER_DOES_NOT_EXIST });
        }
        const stats = await timerService.getStudyStats(userId.id);
        res.json(stats);
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "An error occurred";
        const statusCode = StatusCodeMap[message] || 500;
        res.status(statusCode).json({ error: message });
    }
}
