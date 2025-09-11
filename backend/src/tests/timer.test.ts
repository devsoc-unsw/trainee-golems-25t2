import { createStudySession, getStudyStats } from "../services/timer.service";
import { prisma } from "../lib/prisma";

describe("timer.service", () => {
  let userId: string;

  beforeAll(async () => {
    const user = await prisma.user.create({
      data: {
        email: `timertestuser-${Date.now()}@example.com`,
        name: "Timer Test User",
        password: "Password123!",
      },
    });
    userId = user.id;
  });

  afterAll(async () => {
    await prisma.studySession.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });
    await prisma.$disconnect();
  });

  describe("createStudySession", () => {
    it("creates a valid study session", async () => {
      const start = new Date();
      const end = new Date(start.getTime() + 25 * 60 * 1000); // 25 min later
      const session = await createStudySession(userId, start.toISOString(), end.toISOString());

      expect(session.userId).toBe(userId);
      expect(new Date(session.startTime).getTime()).toBe(start.getTime());
      expect(new Date(session.endTime!).getTime()).toBe(end.getTime());
      expect(session.duration).toBe(25);
    });

    it("throws error for end before start", async () => {
      const start = new Date();
      const end = new Date(start.getTime() - 5 * 60 * 1000);
      await expect(
        createStudySession(userId, start.toISOString(), end.toISOString())
      ).rejects.toThrow("The end time must be after the start time.");
    });
  });

  describe("getStudyStats", () => {
    it("returns correct stats for user", async () => {
      const now = new Date();
      // Create two sessions
      await createStudySession(userId, now.toISOString(), new Date(now.getTime() + 30 * 60 * 1000).toISOString());
      await createStudySession(userId, new Date(now.getTime() + 60 * 60 * 1000).toISOString(), new Date(now.getTime() + 90 * 60 * 1000).toISOString());

      const stats = await getStudyStats(userId);

      expect(stats.totalSessions).toBeGreaterThanOrEqual(2);
      expect(stats.totalStudyTime).toBeGreaterThan(0);
      expect(stats.longestSession).toBeGreaterThan(0);
      expect(stats.currentStreak).toBe(1);
    });
  });
});
