import { Request, Response } from "express";
import multer from "multer";
import { getUserBySession } from "../services/auth.service";
import * as aiService from "../services/ainotes.service";

const upload = multer({ limits: { fileSize: 30 * 1024 * 1024 } }); // 30MB

export const uploadMiddleware = upload.single("file");

export async function create(req: Request, res: Response) {
  const sessionId = req.cookies.sessionId as string | undefined;
  if (!sessionId) return res.status(401).json({ error: "INVALID_SESSION" });
  const user = await getUserBySession(sessionId);
  if (!user) return res.status(401).json({ error: "INVALID_SESSION" });

  const quality = (req.body.quality || "BALANCED").toUpperCase();
  const allowed = ["SIMPLE", "BALANCED", "DETAILED"];
  if (!allowed.includes(quality))
    return res.status(400).json({ error: "INVALID_QUALITY" });

  const file = (
    req as unknown as {
      file?: {
        originalname: string;
        mimetype: string;
        size: number;
        buffer: Buffer;
      };
    }
  ).file;
  if (!file) return res.status(400).json({ error: "MISSING_FILE" });
  if (!file.mimetype || !file.mimetype.includes("pdf"))
    return res.status(400).json({ error: "INVALID_FILE_TYPE" });

  const note = await aiService.createJob(
    user.id,
    file.originalname,
    file.size,
    quality as aiService.NoteQuality,
    req.body.title
  );

  // process in background (fire and forget)
  void aiService.processJob(note, file.buffer);

  return res.json({ id: note.id, status: note.status });
}

export async function getOne(req: Request, res: Response) {
  const sessionId = req.cookies.sessionId as string | undefined;
  if (!sessionId) return res.status(401).json({ error: "INVALID_SESSION" });
  const user = await getUserBySession(sessionId);
  if (!user) return res.status(401).json({ error: "INVALID_SESSION" });

  const id = req.params.id;
  const note = await aiService.getNoteById(id, user.id);
  if (!note) return res.status(404).json({ error: "NOT_FOUND" });
  return res.json(note);
}

export async function list(req: Request, res: Response) {
  const sessionId = req.cookies.sessionId as string | undefined;
  if (!sessionId) return res.status(401).json({ error: "INVALID_SESSION" });
  const user = await getUserBySession(sessionId);
  if (!user) return res.status(401).json({ error: "INVALID_SESSION" });

  const notes = await aiService.listNotes(user.id);
  return res.json(notes);
}

export async function remove(req: Request, res: Response) {
  const sessionId = req.cookies.sessionId as string | undefined;
  if (!sessionId) return res.status(401).json({ error: "INVALID_SESSION" });
  const user = await getUserBySession(sessionId);
  if (!user) return res.status(401).json({ error: "INVALID_SESSION" });

  const id = req.params.id;
  await aiService.deleteNote(id, user.id);
  return res.status(204).send();
}
