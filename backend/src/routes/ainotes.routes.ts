import express from "express";
import * as ctrl from "../controllers/ainotes.controllers";

const router = express.Router();

router.post("/api/ainotes", ctrl.uploadMiddleware, ctrl.create);
router.get("/api/ainotes", ctrl.list);
router.get("/api/ainotes/:id", ctrl.getOne);
router.delete("/api/ainotes/:id", ctrl.remove);

export default router;
