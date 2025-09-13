import { prisma } from "../lib/prisma";
import querystring from "querystring";
import type { User } from "@prisma/client";
// Minimal types for Prisma SpotifyAccount operations to avoid `any`
type SpotifyAccountRecord = {
  userId: string;
  accessToken: string;
  refreshToken: string;
  scope?: string | null;
  tokenType?: string | null;
  expiresAt: Date;
};

type SpotifyAccountRepo = {
  findUnique(args: {
    where: { userId: string };
  }): Promise<SpotifyAccountRecord | null>;
  update(args: {
    where: { userId: string };
    data: Partial<SpotifyAccountRecord>;
  }): Promise<SpotifyAccountRecord>;
  create(args: { data: SpotifyAccountRecord }): Promise<SpotifyAccountRecord>;
  delete(args: { where: { userId: string } }): Promise<unknown>;
};

function getSpotifyAccountRepo(): SpotifyAccountRepo {
  return (prisma as unknown as { spotifyAccount: SpotifyAccountRepo })
    .spotifyAccount;
}

const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize";
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_API_BASE = "https://api.spotify.com/v1";

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

export function buildSpotifyAuthUrl(state: string): string {
  const clientId = getEnv("SPOTIFY_CLIENT_ID");
  const redirectUri = getEnv("SPOTIFY_REDIRECT_URI");
  const scope = getEnv("SPOTIFY_SCOPE");

  const params = querystring.stringify({
    response_type: "code",
    client_id: clientId,
    scope,
    redirect_uri: redirectUri,
    state,
  });

  return `${SPOTIFY_AUTH_URL}?${params}`;
}

async function exchangeToken(code: string) {
  const clientId = getEnv("SPOTIFY_CLIENT_ID");
  const clientSecret = getEnv("SPOTIFY_CLIENT_SECRET");
  const redirectUri = getEnv("SPOTIFY_REDIRECT_URI");

  const body = querystring.stringify({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
  });

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basic}`,
    },
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`SPOTIFY_TOKEN_EXCHANGE_FAILED: ${res.status} ${text}`);
  }

  return (await res.json()) as {
    access_token: string;
    token_type: string;
    scope: string;
    expires_in: number;
    refresh_token: string;
  };
}

async function refreshToken(refreshToken: string) {
  const clientId = getEnv("SPOTIFY_CLIENT_ID");
  const clientSecret = getEnv("SPOTIFY_CLIENT_SECRET");

  const body = querystring.stringify({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basic}`,
    },
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`SPOTIFY_TOKEN_REFRESH_FAILED: ${res.status} ${text}`);
  }

  return (await res.json()) as {
    access_token: string;
    token_type: string;
    scope?: string;
    expires_in: number;
  };
}

export async function saveTokensForUser(
  user: User,
  tokenPayload: {
    access_token: string;
    refresh_token: string;
    scope: string;
    token_type: string;
    expires_in: number;
  }
): Promise<SpotifyAccountRecord> {
  const expiresAt = new Date(Date.now() + tokenPayload.expires_in * 1000);

  const spotifyAccount = getSpotifyAccountRepo();
  const existing = await spotifyAccount.findUnique({
    where: { userId: user.id },
  });

  if (existing) {
    return spotifyAccount.update({
      where: { userId: user.id },
      data: {
        accessToken: tokenPayload.access_token,
        refreshToken: tokenPayload.refresh_token ?? existing.refreshToken,
        scope: tokenPayload.scope,
        tokenType: tokenPayload.token_type,
        expiresAt,
      },
    });
  }

  return spotifyAccount.create({
    data: {
      userId: user.id,
      accessToken: tokenPayload.access_token,
      refreshToken: tokenPayload.refresh_token,
      scope: tokenPayload.scope,
      tokenType: tokenPayload.token_type,
      expiresAt,
    },
  });
}

export async function handleAuthorizationCode(user: User, code: string) {
  const token = await exchangeToken(code);
  return saveTokensForUser(user, {
    access_token: token.access_token,
    refresh_token: token.refresh_token,
    scope: token.scope,
    token_type: token.token_type,
    expires_in: token.expires_in,
  });
}

export async function refreshUserTokens(user: User) {
  const spotifyAccount = getSpotifyAccountRepo();
  const record = await spotifyAccount.findUnique({
    where: { userId: user.id },
  });
  if (!record) throw new Error("SPOTIFY_ACCOUNT_NOT_FOUND");
  const refreshed = await refreshToken(record.refreshToken);
  const expiresAt = new Date(Date.now() + refreshed.expires_in * 1000);

  return spotifyAccount.update({
    where: { userId: user.id },
    data: {
      accessToken: refreshed.access_token,
      scope: refreshed.scope ?? record.scope,
      tokenType: refreshed.token_type ?? record.tokenType,
      expiresAt,
    },
  });
}

export async function getValidAccessToken(user: User): Promise<string> {
  const spotifyAccount = getSpotifyAccountRepo();
  const record = await spotifyAccount.findUnique({
    where: { userId: user.id },
  });
  if (!record) throw new Error("SPOTIFY_ACCOUNT_NOT_FOUND");
  const now = new Date();
  if (record.expiresAt <= now) {
    const updated = await refreshUserTokens(user);
    return updated.accessToken;
  }
  return record.accessToken;
}

async function spotifyApiRequest(
  user: User,
  method: "GET" | "POST" | "PUT" | "DELETE",
  path: string,
  query?: Record<string, string | number | boolean | undefined>,
  body?: unknown
) {
  const token = await getValidAccessToken(user);
  const url = new URL(`${SPOTIFY_API_BASE}${path}`);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined) url.searchParams.set(k, String(v));
    }
  }

  const res = await fetch(url.toString(), {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": body
        ? "application/json"
        : (undefined as unknown as string),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    await refreshUserTokens(user);
    const retryToken = await getValidAccessToken(user);
    const retryRes = await fetch(url.toString(), {
      method,
      headers: {
        Authorization: `Bearer ${retryToken}`,
        "Content-Type": body
          ? "application/json"
          : (undefined as unknown as string),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    return retryRes;
  }

  return res;
}

type SpotifyAlbumImage = { url: string; width: number; height: number };
type SpotifyPlaybackResponse = {
  is_playing: boolean;
  progress_ms: number | null;
  device?: { volume_percent?: number };
  item?: {
    id: string;
    name: string;
    duration_ms: number;
    artists: { name: string }[];
    album?: { name: string; images?: SpotifyAlbumImage[] };
  } | null;
};

export async function getCurrentPlayback(user: User) {
  const res = await spotifyApiRequest(user, "GET", "/me/player");
  if (res.status === 204) return null;
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`SPOTIFY_STATUS_FAILED: ${res.status} ${text}`);
  }
  const json: unknown = await res.json();
  const data = json as SpotifyPlaybackResponse;
  const item = data.item ?? null;
  return {
    isPlaying: data.is_playing,
    progressMs: data.progress_ms,
    volumePercent: data.device?.volume_percent,
    item: item
      ? {
          id: item.id,
          name: item.name,
          durationMs: item.duration_ms,
          artists: (item.artists ?? []).map((a) => a.name),
          album: {
            name: item.album?.name ?? "",
            images: item.album?.images,
          },
        }
      : null,
  };
}

type SpotifyUserProfile = {
  product?: string;
  display_name?: string;
  id?: string;
};

export async function getCurrentUserProfile(user: User) {
  const res = await spotifyApiRequest(user, "GET", "/me");
  if (!res.ok) {
    // If forbidden (e.g., missing scope), return minimal info
    return {
      product: undefined as string | undefined,
      displayName: undefined as string | undefined,
    };
  }
  const json: unknown = await res.json();
  const data = json as SpotifyUserProfile;
  return {
    product: data.product,
    displayName: (data.display_name || data.id) as string | undefined,
  };
}

type SpotifyDevice = {
  id: string;
  is_active?: boolean;
  is_restricted?: boolean;
};

async function getDevices(user: User) {
  const res = await spotifyApiRequest(user, "GET", "/me/player/devices");
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`SPOTIFY_DEVICES_FAILED: ${res.status} ${text}`);
  }
  const json: unknown = await res.json();
  const data = json as { devices?: SpotifyDevice[] };
  return data.devices ?? [];
}

async function transferPlayback(
  user: User,
  deviceId: string,
  playNow: boolean = false
) {
  const res = await spotifyApiRequest(user, "PUT", "/me/player", undefined, {
    device_ids: [deviceId],
    play: playNow,
  });
  if (!res.ok && res.status !== 204) {
    const text = await res.text();
    throw new Error(`SPOTIFY_TRANSFER_FAILED: ${res.status} ${text}`);
  }
}

export async function play(user: User, deviceId?: string) {
  let res = await spotifyApiRequest(
    user,
    "PUT",
    "/me/player/play",
    deviceId ? { device_id: deviceId } : undefined
  );
  if (res.status === 404) {
    const devices = await getDevices(user);
    const target =
      devices.find((d) => d.is_active && !d.is_restricted) ||
      devices.find((d) => !d.is_restricted);
    if (target?.id) {
      await transferPlayback(user, target.id, true);
      res = await spotifyApiRequest(user, "PUT", "/me/player/play");
    }
  }
  if (!res.ok && res.status !== 204)
    throw new Error(`SPOTIFY_PLAY_FAILED: ${res.status}`);
}

export async function pause(user: User, deviceId?: string) {
  let res = await spotifyApiRequest(
    user,
    "PUT",
    "/me/player/pause",
    deviceId ? { device_id: deviceId } : undefined
  );
  if (res.status === 404) {
    const devices = await getDevices(user);
    const target =
      devices.find((d) => d.is_active && !d.is_restricted) ||
      devices.find((d) => !d.is_restricted);
    if (target?.id) {
      await transferPlayback(user, target.id, false);
      res = await spotifyApiRequest(user, "PUT", "/me/player/pause");
    }
  }
  if (!res.ok && res.status !== 204)
    throw new Error(`SPOTIFY_PAUSE_FAILED: ${res.status}`);
}

export async function nextTrack(user: User, deviceId?: string) {
  let res = await spotifyApiRequest(
    user,
    "POST",
    "/me/player/next",
    deviceId ? { device_id: deviceId } : undefined
  );
  if (res.status === 404) {
    const devices = await getDevices(user);
    const target =
      devices.find((d) => d.is_active && !d.is_restricted) ||
      devices.find((d) => !d.is_restricted);
    if (target?.id) {
      await transferPlayback(user, target.id, true);
      res = await spotifyApiRequest(user, "POST", "/me/player/next");
    }
  }
  if (!res.ok && res.status !== 204)
    throw new Error(`SPOTIFY_NEXT_FAILED: ${res.status}`);
}

export async function previousTrack(user: User, deviceId?: string) {
  let res = await spotifyApiRequest(
    user,
    "POST",
    "/me/player/previous",
    deviceId ? { device_id: deviceId } : undefined
  );
  if (res.status === 404) {
    const devices = await getDevices(user);
    const target =
      devices.find((d) => d.is_active && !d.is_restricted) ||
      devices.find((d) => !d.is_restricted);
    if (target?.id) {
      await transferPlayback(user, target.id, true);
      res = await spotifyApiRequest(user, "POST", "/me/player/previous");
    }
  }
  if (!res.ok && res.status !== 204)
    throw new Error(`SPOTIFY_PREVIOUS_FAILED: ${res.status}`);
}

export async function setVolume(
  user: User,
  volumePercent: number,
  deviceId?: string
) {
  const qp: Record<string, string | number> = {
    volume_percent: Math.max(0, Math.min(100, Math.floor(volumePercent))),
  };
  if (deviceId) qp.device_id = deviceId;
  let res = await spotifyApiRequest(user, "PUT", "/me/player/volume", qp);
  if (res.status === 404) {
    const devices = await getDevices(user);
    const target =
      devices.find((d) => d.is_active && !d.is_restricted) ||
      devices.find((d) => !d.is_restricted);
    if (target?.id) {
      await transferPlayback(user, target.id, false);
      res = await spotifyApiRequest(user, "PUT", "/me/player/volume", qp);
    }
  }
  if (!res.ok && res.status !== 204)
    throw new Error(`SPOTIFY_VOLUME_FAILED: ${res.status}`);
}

export async function disconnectSpotify(user: User) {
  const spotifyAccount = getSpotifyAccountRepo();
  const existing = await spotifyAccount.findUnique({
    where: { userId: user.id },
  });
  if (!existing) return;
  await spotifyAccount.delete({ where: { userId: user.id } });
}
