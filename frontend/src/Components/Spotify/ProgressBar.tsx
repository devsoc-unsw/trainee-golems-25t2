import { useMemo } from "react";
import { useSpotifyPlayer } from "../../contexts/useSpotifyPlayer";

function format(ms: number) {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function ProgressBar() {
  const { playback } = useSpotifyPlayer();
  const duration = playback?.item?.durationMs ?? 0;
  const progress = playback?.progressMs ?? 0;
  const ratio = useMemo(
    () => (duration > 0 ? Math.min(1, Math.max(0, progress / duration)) : 0),
    [duration, progress]
  );

  return (
    <div className="flex items-center gap-2">
      <span className="tabular-nums opacity-70 text-[12px]">
        {format(progress || 0)}
      </span>
      <div className="flex-1 h-1.5 bg-white/15 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#1DB954]"
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
      <span className="tabular-nums opacity-70 text-[12px]">
        {format(duration)}
      </span>
    </div>
  );
}
