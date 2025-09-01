import { Request, Response } from "express";
import { StatusCodeMap } from "../constants/errors";
import { getDashboardSummary } from "../services/dash.service";

async function summary(req: Request, res: Response) {
  try {
    const sessionId = req.cookies.sessionId;
    const summary = await getDashboardSummary(sessionId);
    res.json(summary);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An error occurred";
    const statusCode = StatusCodeMap[message] || 500;
    res.status(statusCode).json({ error: message });
  }
}

export { summary };
