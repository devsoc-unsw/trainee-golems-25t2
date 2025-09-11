import { prisma } from "../lib/prisma";
import { ErrorMap } from "../constants/errors";

export async function createStudySession(userId: string, startTime: string, endTime: string) {
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (end <= start) {
        throw new Error(ErrorMap.INVALID_TIME_RANGE);
    }

    return prisma.studySession.create({
        data: {
            userId,
            startTime: start,
            endTime: end,
            duration: Math.floor((end.getTime() - start.getTime()) / 1000 / 60), // duration in minutes
        },
    });
}

export async function getStudyStats(userId: string) {
    const sessions = await prisma.studySession.findMany({
        where: { userId },
    });

    const totalSessions = sessions.length;
    const totalStudyTime = sessions.reduce((acc, session) => acc + (session.duration || 0), 0) / 60; // in hours
    const longestSession = sessions.reduce((max, session) => (session.duration && session.duration > max ? session.duration : max), 0) / 60; // in hours
    // Get all unique session days in descending order
    const sessionDays = Array.from(
        new Set(
            sessions.map(s => {
                const d = new Date(s.startTime);
                d.setHours(0, 0, 0, 0);
                return d.getTime();
            })
        )
    ).sort((a, b) => b - a);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let currentStreak = 0;
    const expected = new Date();
    expected.setHours(0, 0, 0, 0);

    for (const day of sessionDays) {
        if (day === expected.getTime()) {
            currentStreak++;
            expected.setDate(expected.getDate() - 1);
        } else {
            break;
        }
    }

    return {
        totalSessions,
        totalStudyTime, // in hours
        longestSession, // in hours
        currentStreak, // in days
    };
}