const BASE_URL = import.meta.env?.VITE_BACKEND_URL || "http://127.0.0.1:3001";

function url(path: string) {
  return `${BASE_URL}${path}`;
}

function readCookie(name: string): string | undefined {
  const match = document.cookie.match(
    new RegExp("(?:^|; )" + name + "=([^;]*)")
  );
  return match ? decodeURIComponent(match[1]) : undefined;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(url(path), {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    let err: unknown;
    try {
      err = await res.json();
    } catch {
      err = { error: `HTTP_${res.status}` };
    }
    throw err;
  }
  try {
    return (await res.json()) as T;
  } catch {
    return undefined as unknown as T;
  }
}

export type PlaybackItem = {
  id: string;
  name: string;
  durationMs: number;
  artists: string[];
  album: {
    name: string;
    images?: Array<{ url: string; width: number; height: number }>;
  };
};

export type PlaybackStatus = {
  connected: boolean;
  playback: null | {
    isPlaying: boolean;
    progressMs: number | null;
    volumePercent?: number;
    item: PlaybackItem | null;
  };
  profile?: { product?: string; displayName?: string };
};

export const SpotifyApi = {
  connectUrl(): string {
    // If running from localhost, use bridge endpoint that takes a sid
    const isLocalhost = window.location.hostname === "localhost";
    const sid = readCookie("sessionId");
    if (isLocalhost && sid) {
      const u = new URL("http://127.0.0.1:3001/api/spotify/bridge-auth");
      u.searchParams.set("sid", sid);
      return u.toString();
    }
    return "http://127.0.0.1:3001/api/spotify/auth";
  },
  status() {
    return request<PlaybackStatus>("/api/spotify/status");
  },
  play(deviceId?: string) {
    const qp = deviceId ? `?deviceId=${encodeURIComponent(deviceId)}` : "";
    return request<void>(`/api/spotify/play${qp}`, { method: "PUT" });
  },
  pause(deviceId?: string) {
    const qp = deviceId ? `?deviceId=${encodeURIComponent(deviceId)}` : "";
    return request<void>(`/api/spotify/pause${qp}`, { method: "PUT" });
  },
  next(deviceId?: string) {
    const qp = deviceId ? `?deviceId=${encodeURIComponent(deviceId)}` : "";
    return request<void>(`/api/spotify/next${qp}`, { method: "POST" });
  },
  previous(deviceId?: string) {
    const qp = deviceId ? `?deviceId=${encodeURIComponent(deviceId)}` : "";
    return request<void>(`/api/spotify/previous${qp}`, { method: "POST" });
  },
  setVolume(volume: number, deviceId?: string) {
    const qp = deviceId ? `?deviceId=${encodeURIComponent(deviceId)}` : "";
    return request<void>(`/api/spotify/volume${qp}`, {
      method: "PUT",
      body: JSON.stringify({ volume }),
    });
  },
  disconnect() {
    return request<void>(`/api/spotify/disconnect`, { method: "DELETE" });
  },
};
