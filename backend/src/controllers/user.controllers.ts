import { Request, Response } from "express";
import { ErrorMap, StatusCodeMap } from "../constants/errors";
import * as authService from "../services/auth.service";

async function getUserProfile(req: Request, res: Response) {
  try {
    const sessionId = req.cookies.sessionId;
    const user = await authService.getUserBySession(sessionId);
    if (!user) {
      throw new Error(ErrorMap.USER_DOES_NOT_EXIST);
    }
    res.json({
      username: user.name,
      email: user.email,
      avatar: user.avatar || "default_profile_pic_url",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An error occurred";
    const statusCode = StatusCodeMap[message] || 500;
    res.status(statusCode).json({
      error: message,
    });
  }
}

export { getUserProfile }
