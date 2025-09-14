import { prisma } from "../lib/prisma";
import type { User } from "@prisma/client";
import { generateSessionId } from "../dataStore";
import {
  isValidEmail,
  isValidName,
  isValidPassword,
} from "../helpers/users.helpers";

/**
 * Registers a new user and creates a session
 */
export async function authRegister(
  name: string,
  email: string,
  password: string,
  avatar?: string
) {
  // Validate input
  if (isValidName(name) !== true) {
    throw new Error(isValidName(name) as string);
  }

  if (isValidEmail(email, true) !== true) {
    throw new Error(isValidEmail(email) as string);
  }

  if (isValidPassword(password) !== true) {
    throw new Error(isValidPassword(password) as string);
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password, // In production, hash this password!
      avatar,
    },
  });

  // Create session
  const sessionId = generateSessionId();
  const session = await prisma.session.create({
    data: {
      sessionId,
      userId: user.id,
    },
  });

  return {
    sessionId: session.sessionId,
    userId: user.userId,
  };
}

/**
 * Logs in an existing user and creates a session
 */
export async function authLogin(email: string, password: string) {
  // Validate email
  if (isValidEmail(email) !== true) {
    throw new Error(isValidEmail(email) as string);
  }

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("EMAIL_DOES_NOT_EXIST");
  }

  // Check password (in production, compare hashed passwords!)
  if (user.password !== password) {
    throw new Error("PASSWORD_INCORRECT");
  }

  // Create session
  const sessionId = generateSessionId();
  const session = await prisma.session.create({
    data: {
      sessionId,
      userId: user.id,
    },
  });

  return {
    sessionId: session.sessionId,
  };
}

/**
 * Logs out a user by removing their session
 */
export async function authLogout(sessionId: string) {
  await prisma.session.delete({
    where: { sessionId },
  });

  return {};
}

/**
 * Get user by session ID
 */
export async function getUserBySession(
  sessionId: string
): Promise<User | null> {
  const session = await prisma.session.findUnique({
    where: { sessionId },
    include: { user: true },
  });

  return session?.user || null;
}

/**
 * Check if session is valid
 */
export async function isValidSession(sessionId: string): Promise<boolean> {
  const session = await prisma.session.findUnique({
    where: { sessionId },
  });

  return !!session;
}

/**
 * Creates a session for an existing user id
 */
export async function createSessionForUser(userId: string) {
  const sessionId = generateSessionId();
  const session = await prisma.session.create({
    data: {
      sessionId,
      userId,
    },
  });
  return session.sessionId;
}
