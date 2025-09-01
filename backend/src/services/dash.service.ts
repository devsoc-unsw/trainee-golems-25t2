import { prisma } from "../lib/prisma";
import { getUserBySession } from "./auth.service";
import { ErrorMap } from "../constants/errors";

export async function getRecentNotesByUser(userId: string) {
  return await prisma.note.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      updatedAt: true,
    },
    where: { userId },
    orderBy: { updatedAt: "desc" },
    take: 3,
  });
}

export async function getDashboardSummary(sessionId: string) {
  let greeting = "Good Morning";
  const hours = new Date().getHours();
  if (hours >= 12 && hours <= 18) {
    greeting = "Good Afternoon";
  } else if (hours > 18) {
    greeting = "Good Evening";
  }

  const user = await getUserBySession(sessionId);
  if (!user) {
    throw new Error(ErrorMap.USER_DOES_NOT_EXIST);
  }

  const recent_notes = await getRecentNotesByUser(user.id);

  return {
    greeting,
    username: user.name,
    recent_notes,
    accommodation_status: {},
    weekly_progress: [],
  };
}
