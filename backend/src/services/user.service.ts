import { prisma } from "../lib/prisma";
import * as authService from "./auth.service";
import { ErrorMap } from "../constants/errors";

export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id },
  });
}

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

export async function updateUser(
  id: string,
  data: { name?: string; email?: string }
) {
  return await prisma.user.update({
    where: { id },
    data,
  });
}

export async function deleteUser(id: string) {
  return await prisma.user.delete({
    where: { id },
  });
}

export async function getAllUsers() {
  return await prisma.user.findMany();
}

export async function getUserProfile(sessionId: string) {
  const user = await authService.getUserBySession(sessionId);
  if (!user) {
    throw new Error(ErrorMap.INVALID_SESSION);
  }
  return {
    username: user.name,
    email: user.email,
    avatar: user.avatar || "default_profile_pic_url",
  };
}
