import { createContext, useContext } from "react";

export type SpotifyContextValue = {
  connected: boolean;
  loading: boolean;
  error?: string;
  playback: {
    isPlaying: boolean;
    progressMs: number | null;
    volumePercent?: number;
    item: {
      id: string;
      name: string;
      durationMs: number;
      artists: string[];
      album: {
        name: string;
        images?: Array<{ url: string; width: number; height: number }>;
      };
    } | null;
  } | null;
  isPremium: boolean;
  displayName?: string;
  refresh: () => Promise<void>;
  connect: () => void;
  disconnect: () => Promise<void>;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  next: () => Promise<void>;
  previous: () => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
};

export const SpotifyPlayerContext = createContext<
  SpotifyContextValue | undefined
>(undefined);

export function useSpotifyPlayer() {
  const ctx = useContext(SpotifyPlayerContext);
  if (!ctx)
    throw new Error(
      "useSpotifyPlayer must be used within SpotifyPlayerProvider"
    );
  return ctx;
}
