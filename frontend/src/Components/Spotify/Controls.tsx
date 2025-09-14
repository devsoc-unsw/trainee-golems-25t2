import { useSpotifyPlayer } from "../../contexts/useSpotifyPlayer";

export default function Controls() {
  const { play, pause, next, previous, playback, isPremium } =
    useSpotifyPlayer();
  const isPlaying = playback?.isPlaying;
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={previous}
        aria-label="Previous"
        className={btnCls}
        disabled={!isPremium}
        title={!isPremium ? premiumTip : undefined}
      >
        ⏮️
      </button>
      {isPlaying ? (
        <button
          onClick={pause}
          aria-label="Pause"
          className={btnCls}
          disabled={!isPremium}
          title={!isPremium ? premiumTip : undefined}
        >
          ⏸️
        </button>
      ) : (
        <button
          onClick={play}
          aria-label="Play"
          className={btnCls}
          disabled={!isPremium}
          title={!isPremium ? premiumTip : undefined}
        >
          ▶️
        </button>
      )}
      <button
        onClick={next}
        aria-label="Next"
        className={btnCls}
        disabled={!isPremium}
        title={!isPremium ? premiumTip : undefined}
      >
        ⏭️
      </button>
    </div>
  );
}

const btnCls = [
  "inline-flex items-center justify-center",
  "w-9 h-9 rounded-md",
  "border border-white/20 bg-white/10 hover:bg-white/15",
  "text-inherit",
  "cursor-pointer disabled:cursor-not-allowed disabled:opacity-60",
].join(" ");

const premiumTip = "Spotify Premium required to control playback";
