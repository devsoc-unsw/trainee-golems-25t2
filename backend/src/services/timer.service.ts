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
