import { Request, Response } from "express";
import { StatusCodeMap } from "../constants/errors";
import * as userService from "../services/user.service";
import { createSessionForUser } from "../services/auth.service";

async function profile(req: Request, res: Response) {
  try {
    const sessionId = req.cookies.sessionId;
    const profile = await userService.getUserProfile(sessionId);
    res.json(profile);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An error occurred";
    const statusCode = StatusCodeMap[message] || 500;
    res.status(statusCode).json({
      error: message,
    });
  }
}

export { profile };

export async function upsertClerk(req: Request, res: Response) {
  try {
    const {
      id,
      clerkId,
      email,
      name: rawName,
      firstName,
      lastName,
      avatar,
    } = req.body as {
      id?: string;
      clerkId?: string;
      email: string;
      name?: string;
      firstName?: string;
      lastName?: string;
      avatar?: string | null;
    };

    if (!email) {
      return res.status(400).json({ error: "Missing required field: email" });
    }

    const name = (rawName ?? `${firstName ?? ""} ${lastName ?? ""}`)
      .trim()
      .replace(/\s+/g, " ");

    const resolvedId = id ?? clerkId; // optional, if you want to persist Clerk ID as primary key

    const user = await userService.createOrGetClerkUser({
      id: resolvedId,
      email,
      name: name || "No Name",
      avatar,
    });
    // ensure a backend session exists so cookies are set for subsequent API calls
    const sessionId = await createSessionForUser(user.id);
    res.cookie("sessionId", sessionId, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      domain: process.env.NODE_ENV === "production" ? undefined : undefined, // Allow for localhost and 127.0.0.1
    });
    return res.json(user);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An error occurred";
    const statusCode = StatusCodeMap[message] || 500;
    return res.status(statusCode).json({ error: message });
  }
}
