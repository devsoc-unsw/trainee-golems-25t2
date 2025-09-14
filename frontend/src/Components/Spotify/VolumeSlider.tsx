import React, { useState } from "react";
import { useSpotifyPlayer } from "../../contexts/useSpotifyPlayer";

export default function VolumeSlider() {
  const { setVolume, playback, isPremium } = useSpotifyPlayer();
  const [value, setValue] = useState<number>(playback?.volumePercent ?? 50);

  // keep slider in sync with backend updates
  React.useEffect(() => {
    if (typeof playback?.volumePercent === "number") {
      setValue(playback.volumePercent);
    }
  }, [playback?.volumePercent]);

  return (
    <div className="flex items-center gap-2 w-full">
      <span className="opacity-70">🔈</span>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => setValue(parseInt(e.target.value))}
        onChangeCapture={() => {
          if (isPremium) setVolume(value);
        }}
        className="flex-1 accent-[#1DB954] disabled:opacity-60 disabled:cursor-not-allowed"
        aria-label="Volume"
        disabled={!isPremium}
        title={
          !isPremium ? "Spotify Premium required to control volume" : undefined
        }
      />
      <span className="opacity-70">🔊</span>
    </div>
  );
}
