import { useSpotifyPlayer } from "../../contexts/useSpotifyPlayer";

export default function ConnectButton() {
  const { connect, loading } = useSpotifyPlayer();
  return (
    <button
      onClick={connect}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-lg bg-[#1DB954] px-3.5 py-2.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
    >
      <img
        src="/spotify-logo.png"
        alt="Spotify"
        width={18}
        height={18}
        className="h-[18px] w-[18px]"
      />
      <span>Connect Spotify</span>
    </button>
  );
}
