import request from "supertest";
import { app } from "../server";
import { Email, Name, Password } from "../constants/types";

type HttpVerb = "GET" | "POST" | "PUT" | "DELETE";

interface RequestOptions {
  method: HttpVerb;
  path: string;
  payload?: object;
  session?: string;
}

export async function requestHelper({
  method,
  path,
  payload,
  session,
}: RequestOptions) {
  let req = request(app)[method.toLowerCase() as "get" | "post" | "put" | "delete"](path);

  if (session) {
    req = req.set("session", session);
  }

  if (payload && ["POST", "PUT"].includes(method)) {
    req = req.send(payload);
  } else if (payload && ["GET", "DELETE"].includes(method)) {
    req = req.query(payload);
  }

  return await req;
}

export async function requestAuthRegister(
  name: Name,
  email: Email,
  password: Password
) {
  return await requestHelper({
    method: "POST",
    path: "/auth/register",
    payload: { name, email, password },
  });
}

export async function requestAuthLogin(email: Email, password: Password) {
  return await requestHelper({
    method: "POST",
    path: "/auth/login",
    payload: { email, password },
  });
}

export async function requestAuthLogout(session: string) {
  return await requestHelper({
    method: "DELETE",
    path: "/auth/logout",
    payload: {},
    session,
  });
}

export async function requestClear() {
  return await requestHelper({
    method: "DELETE",
    path: "/clear",
    payload: {},
  });
}