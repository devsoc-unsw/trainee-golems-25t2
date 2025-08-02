import { prisma } from "./lib/prisma";

// Test database setup and cleanup utilities

export async function clearDatabase() {
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
}

export async function createTestUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  return await prisma.user.create({
    data,
  });
}

export async function createTestSession(userId: string, sessionId: string) {
  return await prisma.session.create({
    data: {
      sessionId,
      userId,
    },
  });
}