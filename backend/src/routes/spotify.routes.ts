import express from "express";
import * as spotifyController from "../controllers/spotify.controllers";
import { spotifyRateLimiter } from "../middleware";

const router = express.Router();

router.use(spotifyRateLimiter);

router.get("/api/spotify/auth", spotifyController.auth);
router.get("/api/spotify/callback", spotifyController.callback);
router.get("/api/spotify/bridge-auth", spotifyController.bridgeAuth);
router.post("/api/spotify/refresh", spotifyController.refresh);
router.get("/api/spotify/status", spotifyController.status);
router.put("/api/spotify/play", spotifyController.playHandler);
router.put("/api/spotify/pause", spotifyController.pauseHandler);
router.post("/api/spotify/next", spotifyController.nextHandler);
router.post("/api/spotify/previous", spotifyController.previousHandler);
router.put("/api/spotify/volume", spotifyController.volumeHandler);
router.delete("/api/spotify/disconnect", spotifyController.disconnect);

export default router;
