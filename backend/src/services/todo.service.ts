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

export async function createTask(userId: string, title: string, description?: string) {
    return await prisma.task.create({
        data: {
            userId,
            title,
            description,
        },
    });
}