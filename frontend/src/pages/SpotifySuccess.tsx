import { useEffect } from "react";
import { useSpotifyPlayer } from "../contexts/useSpotifyPlayer";

export default function SpotifySuccess() {
  const { refresh } = useSpotifyPlayer();
  useEffect(() => {
    refresh();
  }, [refresh]);
  return (
    <div style={{ padding: 24 }}>
      <h2>Spotify Connected</h2>
      <p>You can close this tab or return to the app.</p>
    </div>
  );
}
