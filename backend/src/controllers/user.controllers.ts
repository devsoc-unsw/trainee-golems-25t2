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

export async function upsertClerk(req: Request, res: Response) {
  try {
    const { id, email, name, avatar } = req.body as {
      id?: string;
      email: string;
      name: string;
      avatar?: string | null;
    };
    if (!email || !name) {
      return res.status(400).json({ error: "Missing required fields: email, name" });
    }
    const user = await userService.createOrGetClerkUser({ id, email, name, avatar });
    return res.json(user);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An error occurred";
    const statusCode = StatusCodeMap[message] || 500;
    return res.status(statusCode).json({ error: message });
  }
}
