import { Request, Response } from "express";
import * as authService from "../services/auth.services";

// register - post HTTP method
async function register(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;
    const auth = authService.authRegister(name, email, password);

    res.cookie("sessionId", auth.sessionId, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: false, //CHANGE LATER
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.json(auth);
  } catch (err: unknown) {
    res.status(400).json({
      error: err instanceof Error ? err.message : "An error occurred",
    });
  }
}

// login - post HTTP method
async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const auth = authService.authLogin(email, password);

    res.cookie("sessionId", auth.sessionId, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: false, //CHANGE LATER
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.json(auth);
  } catch (err: unknown) {
    res.status(400).json({
      error: err instanceof Error ? err.message : "An error occurred",
    });
  }
}

// logout - delete HTTP method
async function logout(req: Request, res: Response) {
  try {
    const session = req.cookies.sessionId;
    const auth = authService.authLogout(session as string);

    res.clearCookie("sessionId", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.json(auth);
  } catch (err: unknown) {
    res.status(400).json({
      error: err instanceof Error ? err.message : "An error occurred",
    });
  }
}

export { register, login, logout };
