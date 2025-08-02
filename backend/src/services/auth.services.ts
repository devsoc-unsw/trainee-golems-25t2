
import { ErrorMap } from "../constants/errors";

import {
  Name,
  Email,
  Password,
  Session,
  UserId,
  User,
  SessionId,
} from "../constants/types";
import {
  generateSessionId,
  getData,
  getSessions,
  setData,
  setSessions,
} from "../dataStore";
import {
  isValidEmail,
  isValidName,
  isValidPassword,
} from "../helpers/users.helpers";

function generateUserId(): UserId {
  return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
}

/**
 * Registers and logs in a new email and returns a session
 * @param name
 * @param email
 * @param password
 */
export function authRegister(
  name: Name,
  email: Email,
  password: Password
): Session {
  // name is greater than 100 or less than 1 characters
  if (isValidName(name) !== true) {
    throw new Error(isValidName(name) as string);
  }

  // name is greater than 100 or less than 1 characters
  if (isValidEmail(email, true) !== true) {
    throw new Error(isValidEmail(email) as string);
  }

  // password should have 1 uppercase, 1 lowercase, and 1 number
  if (isValidPassword(password) !== true) {
    throw new Error(isValidPassword(password) as string);
  }

  const userId = generateUserId();

  const sessions: Session[] = getSessions();
  const session: Session = {
    sessionId: generateSessionId(), // check this out further
    userId: userId,
  };
  sessions.push(session);
  setSessions(sessions);

  const database = getData();
  const user: User = {
    name: name,
    email: email,
    password: password,
    userId: userId,
  };
  database.users.push(user);

  setData(database);
  return session;
}

/**
 * Logs in an existing user and returns a session
 * @param email
 * @param password
 */
export function authLogin(email: Email, password: Password) {
  const store = getData();

  // if email does not have suffix
  if (isValidEmail(email) !== true) {
    throw new Error(isValidEmail(email) as string);
  }

  // find the user from the email
  const user = store.users.find((user) => user.email === email);

  // if email does not exist
  if (!user || user === undefined) {
    throw new Error(ErrorMap["EMAIL_DOES_NOT_EXIST"]);
  }

  // if password is incorrect
  if (user.password !== password) {
    throw new Error(ErrorMap["PASSWORD_INCORRECT"]);
  }

  const sessions: Session[] = getSessions();
  const sessionId = generateSessionId();
  const session: Session = {
    sessionId: sessionId,
    userId: user.userId,
  };
  sessions.push(session);
  setSessions(sessions);

  return { sessionId: sessionId };
}

export function authLogout(sessionId: SessionId) {
  const store = getSessions();
  const sessions = store.filter((session) => session.sessionId !== sessionId);
  setSessions(sessions);

  return {};
}
