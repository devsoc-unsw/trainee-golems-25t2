import { useSpotifyPlayer } from "../../contexts/useSpotifyPlayer";
import ConnectButton from "./ConnectButton";
import MiniPlayer from "./MiniPlayer";
import spotifyLogo from "../../assets/spotify-logo.png";

export default function SpotifyWidget() {
  const { connected, loading, error, disconnect, isPremium, displayName } =
    useSpotifyPlayer();

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-black/60 p-3 text-white w-full max-w-md overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src={spotifyLogo}
            width={18}
            height={18}
            alt="Spotify"
            className="h-[18px] w-[18px]"
          />
          <span className="font-bold">Spotify</span>
        </div>
        {connected && (
          <div className="flex items-center gap-2">
            <span className="text-[12px] opacity-70">
              {loading ? "Updating..." : "Connected"}
            </span>
            <button
              onClick={disconnect}
              className="rounded-md border border-white/20 bg-transparent px-2 py-1 text-[12px] text-inherit hover:bg-white/5"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>

      {!connected ? (
        <div className="flex items-center gap-3">
          <ConnectButton />
          <span className="text-[13px] opacity-80">
            Connect your Spotify account to control music.
          </span>
        </div>
      ) : (
        <MiniPlayer />
      )}

      {connected && !isPremium && (
        <div className="rounded-lg border border-dashed border-white/20 bg-white/5 p-2.5 text-[12px] leading-relaxed">
          <div className="mb-1 font-semibold">
            Playback controls require Spotify Premium
          </div>
          <div>
            Signed in as {displayName || "your account"}. You can still view
            what’s playing, but play/pause, next/previous, and volume control
            are disabled.
          </div>
        </div>
      )}

      {error && <div className="text-[12px] text-red-300">Error: {error}</div>}
    </div>
  );
}
