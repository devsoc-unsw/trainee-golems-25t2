import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { SpotifyApi, type PlaybackStatus } from "../api/spotify";
import {
  SpotifyPlayerContext,
  type SpotifyContextValue,
} from "./useSpotifyPlayer";

export function SpotifyPlayerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [playback, setPlayback] = useState<PlaybackStatus["playback"]>(null);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState<string | undefined>(undefined);
  const pollRef = useRef<number | undefined>(undefined);

  const refresh = useCallback(async () => {
    try {
      const data = await SpotifyApi.status();
      setConnected(Boolean(data.connected));
      setPlayback(data.playback);
      setIsPremium(
        (data.profile?.product || "free").toLowerCase() === "premium"
      );
      setDisplayName(data.profile?.displayName);
      setError(undefined);
    } catch (e: unknown) {
      const message =
        typeof e === "object" &&
        e !== null &&
        "error" in (e as Record<string, unknown>)
          ? String((e as Record<string, unknown>).error)
          : "Failed to load Spotify status";
      setError(message);
      setConnected(false);
      setPlayback(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    pollRef.current = window.setInterval(refresh, 1000);
    return () => {
      if (pollRef.current) window.clearInterval(pollRef.current);
    };
  }, [refresh]);

  const connect = useCallback(() => {
    window.location.href = SpotifyApi.connectUrl();
  }, []);

  const disconnect = useCallback(async () => {
    await SpotifyApi.disconnect();
    await refresh();
  }, [refresh]);

  const play = useCallback(async () => {
    await SpotifyApi.play();
    await refresh();
  }, [refresh]);

  const pause = useCallback(async () => {
    await SpotifyApi.pause();
    await refresh();
  }, [refresh]);

  const next = useCallback(async () => {
    await SpotifyApi.next();
    await refresh();
  }, [refresh]);

  const previous = useCallback(async () => {
    await SpotifyApi.previous();
    await refresh();
  }, [refresh]);

  const setVolume = useCallback(
    async (volume: number) => {
      await SpotifyApi.setVolume(volume);
      await refresh();
    },
    [refresh]
  );

  const value = useMemo<SpotifyContextValue>(
    () => ({
      connected,
      loading,
      error,
      playback,
      isPremium,
      displayName,
      refresh,
      connect,
      disconnect,
      play,
      pause,
      next,
      previous,
      setVolume,
    }),
    [
      connected,
      loading,
      error,
      playback,
      isPremium,
      displayName,
      refresh,
      connect,
      disconnect,
      play,
      pause,
      next,
      previous,
      setVolume,
    ]
  );

  return (
    <SpotifyPlayerContext.Provider value={value}>
      {children}
    </SpotifyPlayerContext.Provider>
  );
}
