import { SpotifyPlayerProvider } from "../../contexts/SpotifyPlayerContext";
import SpotifyWidget from "./Widget";

export default function SpotifyModule() {
  return (
    <SpotifyPlayerProvider>
      <SpotifyWidget />
    </SpotifyPlayerProvider>
  );
}
