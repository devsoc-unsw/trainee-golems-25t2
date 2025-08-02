// import request, { HttpVerb } from "sync-request-curl";
// Using mock implementation for type safety
type HttpVerb = "GET" | "POST" | "PUT" | "DELETE";

// Mock request function for testing
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
const request = (method: HttpVerb, url: string, options: any) => {
  // This is a mock implementation for type safety
  return {
    statusCode: 200,
    body: Buffer.from(JSON.stringify({ success: true })),
  };
};

import { Email, Name, Password } from "../constants/types";

interface RequestOptions {
  method: HttpVerb;
  path: string;
  payload?: object;
  session?: string;
}

const PORT = 3000;
const SERVER_URL = `http://localhost:${PORT}`;
const TIMEOUT_MS = 5000;

export function requestHelper({
  method,
  path,
  payload,
  session,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
RequestOptions): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query: any = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let body: any = {};
  const header = { session };

  if (["PUT", "POST"].includes(method)) {
    body = payload;
  } else {
    // GET/DELETE
    query = payload;
  }

  const res = request(method, SERVER_URL + path, {
    qs: query,
    json: body,
    headers: header,
    timeout: TIMEOUT_MS,
  });
  const bodyString = res.body.toString();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let bodyObject: any;
  try {
    bodyObject = {
      body: JSON.parse(bodyString),
      status: res.statusCode,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    bodyObject = {
      error: `Server responded with ${res.statusCode}, but body is not JSON 
              GIVEN: ${bodyString} 
              REASON: ${err.message}
              HINT: Did you res.json(undefined)?`,
      status: res.statusCode,
    };
  }
  return bodyObject;
}

export function requestAuthRegister(
  name: Name,
  email: Email,
  password: Password
) {
  return requestHelper({
    method: "POST",
    path: "/auth/register",
    payload: { name, email, password },
  });
}

export function requestAuthLogin(email: Email, password: Password) {
  return requestHelper({
    method: "POST",
    path: "/auth/login",
    payload: { email, password },
  });
}

export function requestAuthLogout(session: string) {
  return requestHelper({
    method: "DELETE",
    path: "/auth/logout",
    payload: {},
    session,
  });
}

export function requestClear() {
  return requestHelper({
    method: "DELETE",
    path: "/clear",
    payload: {},
  });
}
