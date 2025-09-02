import { Request, Response } from "express";
import { StatusCodeMap } from "../constants/errors";
import * as userService from "../services/user.service";

async function profile(req: Request, res: Response) {
  try {
    const sessionId = req.cookies.sessionId;
    const profile = await userService.getUserProfile(sessionId);
    res.json(profile);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An error occurred";
    const statusCode = StatusCodeMap[message] || 500;
    res.status(statusCode).json({
      error: message
    });
  }
}

export { profile }
