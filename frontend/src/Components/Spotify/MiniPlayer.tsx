import { useSpotifyPlayer } from "../../contexts/useSpotifyPlayer";
import Controls from "./Controls";
import ProgressBar from "./ProgressBar";
import VolumeSlider from "./VolumeSlider";

export default function MiniPlayer() {
  const { playback } = useSpotifyPlayer();
  const item = playback?.item;
  const artwork =
    item?.album.images?.[item.album.images.length - 1]?.url ||
    item?.album.images?.[0]?.url;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-gradient-to-b from-[#1DB954]/15 to-[#1DB954]/5 p-3 text-white w-full max-w-md overflow-hidden">
      {artwork ? (
        <img
          src={artwork}
          alt={item?.name || "Album art"}
          width={48}
          height={48}
          className="h-12 w-12 rounded-md object-cover"
        />
      ) : (
        <div className="h-12 w-12 rounded-md bg-white/10" />
      )}

      <div className="flex flex-1 flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="font-semibold truncate">
              {item?.name || "Not playing"}
            </div>
            <div className="text-[12px] opacity-70 truncate">
              {item?.artists?.join(", ") || ""}
            </div>
          </div>
          <div className="shrink-0">
            <Controls />
          </div>
        </div>
        <div className="w-full">
          <ProgressBar />
        </div>
        <div className="w-full">
          <VolumeSlider />
        </div>
      </div>
    </div>
  );
}
