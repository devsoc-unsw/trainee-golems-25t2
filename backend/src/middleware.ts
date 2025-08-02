import { Request, Response, NextFunction } from "express";
import { isValidSession } from "./services/auth.service";
import { ErrorMap, StatusCodeMap } from "./constants/errors";

// import { getSessionsCollection } from "./db";

// Session check middleware
async function sessionMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const sessionId = req.cookies.sessionId;
    
    if (!sessionId) {
      return next({
        status: StatusCodeMap[ErrorMap["INVALID_SESSION"]],
        message: ErrorMap["INVALID_SESSION"],
      });
    }

    const isValid = await isValidSession(sessionId);
    
    if (!isValid) {
      return next({
        status: StatusCodeMap[ErrorMap["INVALID_SESSION"]],
        message: ErrorMap["INVALID_SESSION"],
      });
    }

    next();
  } catch (e) {
    console.error("Session Middleware Error:", e);
    return next(e);
  }
}

// Error catching and throwing middleware
function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) {
  const message = err.message;
  const status = StatusCodeMap[message];
  res.status(status).json({ error: message });
}

export { errorMiddleware, sessionMiddleware };
