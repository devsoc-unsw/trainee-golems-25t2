import { prisma } from "../lib/prisma";

export async function getTasks(userId: string) {
    return await prisma.task.findMany({
        select: {
            id: true,
            title: true,
            description: true,
            isCompleted: true,
        },
        where: { userId },
        orderBy: { createdAt: "desc" },
    });
}