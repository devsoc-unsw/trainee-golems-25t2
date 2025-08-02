import { Request, Response, NextFunction } from 'express';
import { loadSessions, getSessions } from './dataStore';
import { ErrorMap, StatusCodeMap } from './constants/errors';
import { Session } from './constants/types';
// import { getSessionsCollection } from "./db";

// Session check middleware
async function sessionMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    loadSessions();
    const sessionId = req.cookies.sessionId;
    let sessions: Session[] = getSessions();
    const sessionExists = sessions.find((s) => s.sessionId === sessionId);

    if (!sessionId || !sessionExists) {
      // Next error rather than throw is due to this being an asynchronous function
      return next({
        status: StatusCodeMap[ErrorMap['INVALID_SESSION']],
        message: ErrorMap['INVALID_SESSION'],
      });
    }

    next();
  } catch (e) {
    console.error('Session Middleware Error:', e);
    return next(e);
  }
}

// Error catching and throwing middleware
function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const message = err.message;
  const status = StatusCodeMap[message];
  res.status(status).json({ error: message });
}

export { errorMiddleware, sessionMiddleware };
