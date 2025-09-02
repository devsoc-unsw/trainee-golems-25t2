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

export async function getAccommodationByUser(userId: string) {
  return await prisma.accommodation.findFirst({
    select: {
      id: true,
      name: true,
      location: true,
      status: true,
    },
    where: { userId },
  });
}

export async function getMarketplaceItemByUser(userId: string) {
  return await prisma.marketplaceItem.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      price: true,
      status: true,
    },
    where: { userId },
  });
}

export async function getWeeklyProgressByUser(userId: string) {
  const now = new Date();
  const startOfWeek = new Date();
  startOfWeek.setDate(now.getDate() - 6);
  return await prisma.studySession.findMany({
    select: {
      id: true,
      startTime: true,
      endTime: true,
    },
    where: {
      userId,
      startTime: {
        gte: startOfWeek,
        lte: new Date(),
      },
    },
  });
}

export async function getStatsByUser(userId: string) {
  const studySessions = await getWeeklyProgressByUser(userId);
  const totalDuration = studySessions.reduce((sum: number, s: { endTime: Date | null; startTime: Date }) => {
    if (!s.endTime) {
      return sum;
    } else {
      return sum + (s.endTime.getTime() - s.startTime.getTime()) / 1000;
    }
  }, 0);
  const dayStreaks = new Set(
    studySessions.map((s: { startTime: Date }) => s.startTime.toDateString())
  ).size;
  return { totalDuration, dayStreaks };
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
  const accommodation_status = await getAccommodationByUser(user.id);
  const marketplace_items = await getMarketplaceItemByUser(user.id);
  const weekly_progress = await getWeeklyProgressByUser(user.id);

  return {
    greeting,
    username: user.name,
    recent_notes,
    accommodation_status,
    marketplace_items,
    weekly_progress,
  };
}
