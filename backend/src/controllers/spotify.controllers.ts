import { Request, Response } from "express";
import {
  buildSpotifyAuthUrl,
  handleAuthorizationCode,
  refreshUserTokens,
  getCurrentPlayback,
  play,
  pause,
  nextTrack,
  previousTrack,
  setVolume,
  disconnectSpotify,
  getCurrentUserProfile,
} from "../services/spotify.service";
import { getUserBySession } from "../services/auth.service";
import crypto from "crypto";
import { isValidSession } from "../services/auth.service";

export async function auth(req: Request, res: Response) {
  const sessionId = req.cookies.sessionId as string | undefined;
  if (!sessionId) return res.status(401).json({ error: "INVALID_SESSION" });

  const user = await getUserBySession(sessionId);
  if (!user) return res.status(401).json({ error: "INVALID_SESSION" });

  const state = crypto.randomBytes(16).toString("hex");
  res.cookie("spotify_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 10 * 60 * 1000,
  });

  const url = buildSpotifyAuthUrl(state);
  res.redirect(url);
}

export async function callback(req: Request, res: Response) {
  const sessionId = req.cookies.sessionId as string | undefined;
  if (!sessionId) return res.status(401).json({ error: "INVALID_SESSION" });

  const user = await getUserBySession(sessionId);
  if (!user) return res.status(401).json({ error: "INVALID_SESSION" });

  const { code, state } = req.query as { code?: string; state?: string };
  const expectedState = req.cookies.spotify_oauth_state as string | undefined;
  if (!code || !state || !expectedState || state !== expectedState) {
    return res.status(400).json({ error: "SPOTIFY_INVALID_STATE_OR_CODE" });
  }

  try {
    await handleAuthorizationCode(user, code);
    res.clearCookie("spotify_oauth_state", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    const successUrl =
      process.env.SPOTIFY_SUCCESS_REDIRECT_URL || "/spotify/success";
    res.redirect(successUrl);
  } catch (e) {
    res.status(400).json({
      error: e instanceof Error ? e.message : "SPOTIFY_CALLBACK_FAILED",
    });
  }
}

export async function refresh(req: Request, res: Response) {
  const sessionId = req.cookies.sessionId as string | undefined;
  if (!sessionId) return res.status(401).json({ error: "INVALID_SESSION" });

  const user = await getUserBySession(sessionId);
  if (!user) return res.status(401).json({ error: "INVALID_SESSION" });

  try {
    const updated = await refreshUserTokens(user);
    res.json({
      accessToken: updated.accessToken,
      expiresAt: updated.expiresAt,
    });
  } catch (e) {
    res.status(400).json({
      error: e instanceof Error ? e.message : "SPOTIFY_REFRESH_FAILED",
    });
  }
}

// Bridge endpoint to allow frontend on localhost to initiate OAuth on 127.0.0.1
export async function bridgeAuth(req: Request, res: Response) {
  const sid = req.query.sid as string | undefined;
  if (!sid) return res.status(400).json({ error: "MISSING_SESSION" });
  const valid = await isValidSession(sid);
  if (!valid) return res.status(401).json({ error: "INVALID_SESSION" });

  // Set session cookie for current host (e.g., 127.0.0.1)
  res.cookie("sessionId", sid, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  const state = crypto.randomBytes(16).toString("hex");
  res.cookie("spotify_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 10 * 60 * 1000,
  });

  const url = buildSpotifyAuthUrl(state);
  res.redirect(url);
}

export async function status(req: Request, res: Response) {
  const sessionId = req.cookies.sessionId as string | undefined;
  if (!sessionId) return res.status(401).json({ error: "INVALID_SESSION" });
  const user = await getUserBySession(sessionId);
  if (!user) return res.status(401).json({ error: "INVALID_SESSION" });
  try {
    const [data, profile] = await Promise.all([
      getCurrentPlayback(user),
      getCurrentUserProfile(user),
    ]);
    res.json({
      connected: true,
      playback: data,
      profile: { product: profile.product, displayName: profile.displayName },
    });
  } catch (e) {
    res.status(400).json({
      error: e instanceof Error ? e.message : "SPOTIFY_STATUS_FAILED",
    });
  }
}

export async function playHandler(req: Request, res: Response) {
  const sessionId = req.cookies.sessionId as string | undefined;
  if (!sessionId) return res.status(401).json({ error: "INVALID_SESSION" });
  const user = await getUserBySession(sessionId);
  if (!user) return res.status(401).json({ error: "INVALID_SESSION" });
  const deviceId = req.query.deviceId as string | undefined;
  try {
    await play(user, deviceId);
    res.status(204).send();
  } catch (e) {
    res
      .status(400)
      .json({ error: e instanceof Error ? e.message : "SPOTIFY_PLAY_FAILED" });
  }
}

export async function pauseHandler(req: Request, res: Response) {
  const sessionId = req.cookies.sessionId as string | undefined;
  if (!sessionId) return res.status(401).json({ error: "INVALID_SESSION" });
  const user = await getUserBySession(sessionId);
  if (!user) return res.status(401).json({ error: "INVALID_SESSION" });
  const deviceId = req.query.deviceId as string | undefined;
  try {
    await pause(user, deviceId);
    res.status(204).send();
  } catch (e) {
    res
      .status(400)
      .json({ error: e instanceof Error ? e.message : "SPOTIFY_PAUSE_FAILED" });
  }
}

export async function nextHandler(req: Request, res: Response) {
  const sessionId = req.cookies.sessionId as string | undefined;
  if (!sessionId) return res.status(401).json({ error: "INVALID_SESSION" });
  const user = await getUserBySession(sessionId);
  if (!user) return res.status(401).json({ error: "INVALID_SESSION" });
  const deviceId = req.query.deviceId as string | undefined;
  try {
    await nextTrack(user, deviceId);
    res.status(204).send();
  } catch (e) {
    res
      .status(400)
      .json({ error: e instanceof Error ? e.message : "SPOTIFY_NEXT_FAILED" });
  }
}

export async function previousHandler(req: Request, res: Response) {
  const sessionId = req.cookies.sessionId as string | undefined;
  if (!sessionId) return res.status(401).json({ error: "INVALID_SESSION" });
  const user = await getUserBySession(sessionId);
  if (!user) return res.status(401).json({ error: "INVALID_SESSION" });
  const deviceId = req.query.deviceId as string | undefined;
  try {
    await previousTrack(user, deviceId);
    res.status(204).send();
  } catch (e) {
    res.status(400).json({
      error: e instanceof Error ? e.message : "SPOTIFY_PREVIOUS_FAILED",
    });
  }
}

export async function volumeHandler(req: Request, res: Response) {
  const sessionId = req.cookies.sessionId as string | undefined;
  if (!sessionId) return res.status(401).json({ error: "INVALID_SESSION" });
  const user = await getUserBySession(sessionId);
  if (!user) return res.status(401).json({ error: "INVALID_SESSION" });
  const { volume } = req.body as { volume: number };
  const deviceId = req.query.deviceId as string | undefined;
  try {
    await setVolume(user, volume, deviceId);
    res.status(204).send();
  } catch (e) {
    res.status(400).json({
      error: e instanceof Error ? e.message : "SPOTIFY_VOLUME_FAILED",
    });
  }
}

export async function disconnect(req: Request, res: Response) {
  const sessionId = req.cookies.sessionId as string | undefined;
  if (!sessionId) return res.status(401).json({ error: "INVALID_SESSION" });
  const user = await getUserBySession(sessionId);
  if (!user) return res.status(401).json({ error: "INVALID_SESSION" });
  try {
    await disconnectSpotify(user);
    res.status(204).send();
  } catch (e) {
    res.status(400).json({
      error: e instanceof Error ? e.message : "SPOTIFY_DISCONNECT_FAILED",
    });
  }
}
