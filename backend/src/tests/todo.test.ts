import request from "supertest";
import { app } from "../server";
import { prisma } from "../lib/prisma";

let testUserId: string;
let testSessionId = "test-todo-session-id";
let createdTaskId: string;

beforeAll(async () => {
    // Create a user and session directly in the DB
    const user = await prisma.user.upsert({
        where: { email: "todouser@example.com" },
        update: {}, // nothing to update
        create: {
            email: "todouser@example.com",
            name: "Todo User",
            password: "Password123!",
        },
    });
    testUserId = user.id;
    await prisma.session.create({
        data: {
            sessionId: testSessionId,
            userId: testUserId,
        },
    });
});

afterAll(async () => {
    await prisma.task.deleteMany({ where: { userId: testUserId } });
    await prisma.user.delete({ where: { id: testUserId } });
    await prisma.session.deleteMany({ where: { userId: testUserId } });
    await prisma.$disconnect();
});

describe("Todo API", () => {
    describe("POST /api/todos", () => {
        test("should create a new task", async () => {
            const response = await request(app)
                .post("/api/todos")
                .set("Cookie", `sessionId=${testSessionId}`)
                .send({ title: "Test Task", description: "Test Description" });
            expect(response.status).toBe(200);
            expect(response.body.title).toBe("Test Task");
            expect(response.body.description).toBe("Test Description");
            expect(response.body.isCompleted).toBe(false);
            createdTaskId = response.body.id;
        });

        test("should return 400 for missing title", async () => {
            const response = await request(app)
                .post("/api/todos")
                .set("Cookie", `sessionId=${testSessionId}`)
                .send({ description: "No title" });
            expect(response.status).toBe(400);
            expect(response.body.error).toMatch(/missing/i);
        });

        test("should return 400 for too long title", async () => {
            const response = await request(app)
                .post("/api/todos")
                .set("Cookie", `sessionId=${testSessionId}`)
                .send({ title: "a".repeat(101), description: "desc" });
            expect(response.status).toBe(400);
            expect(response.body.error).toMatch(/less than 100/i);
        });

        test("should return 400 for too long description", async () => {
            const response = await request(app)
                .post("/api/todos")
                .set("Cookie", `sessionId=${testSessionId}`)
                .send({ title: "Valid title", description: "a".repeat(501) });
            expect(response.status).toBe(400);
            expect(response.body.error).toMatch(/less than 500/i);
        });
    });

    describe("GET /api/todos", () => {
        test("should get all tasks", async () => {
            const response = await request(app)
                .get("/api/todos")
                .set("Cookie", `sessionId=${testSessionId}`);
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.some((task: any) => task.id === createdTaskId)).toBe(true);
        });

        test("should return 401 for invalid session", async () => {
            const response = await request(app)
                .get("/api/todos")
                .set("Cookie", "sessionId=invalid-session");
            expect(response.status).toBe(401);
        });
    });

    describe("PUT /api/todos/:id", () => {
        test("should update a task", async () => {
            const response = await request(app)
                .put(`/api/todos/${createdTaskId}`)
                .set("Cookie", `sessionId=${testSessionId}`)
                .send({ title: "Updated Task", isCompleted: true });
            expect(response.status).toBe(200);
            expect(response.body.title).toBe("Updated Task");
            expect(response.body.isCompleted).toBe(true);
        });

        test("should return 400 for too long title", async () => {
            const response = await request(app)
                .put(`/api/todos/${createdTaskId}`)
                .set("Cookie", `sessionId=${testSessionId}`)
                .send({ title: "a".repeat(101) });
            expect(response.status).toBe(400);
            expect(response.body.error).toMatch(/less than 100/i);
        });

        test("should return 400 for too long description", async () => {
            const response = await request(app)
                .put(`/api/todos/${createdTaskId}`)
                .set("Cookie", `sessionId=${testSessionId}`)
                .send({ description: "a".repeat(501) });
            expect(response.status).toBe(400);
            expect(response.body.error).toMatch(/less than 500/i);
        });

        test("should return 401 for invalid session", async () => {
            const response = await request(app)
                .put(`/api/todos/${createdTaskId}`)
                .set("Cookie", "sessionId=invalid-session")
                .send({ title: "Should not update" });
            expect(response.status).toBe(401);
        });

        test("should return 500 for updating non-existent task", async () => {
            const response = await request(app)
                .put(`/api/todos/nonexistentid`)
                .set("Cookie", `sessionId=${testSessionId}`)
                .send({ title: "Should not update" });
            expect(response.status).toBe(500);
        });
    });

    describe("DELETE /api/todos/:id", () => {
        test("should delete a task", async () => {
            const response = await request(app)
                .delete(`/api/todos/${createdTaskId}`)
                .set("Cookie", `sessionId=${testSessionId}`);
            expect(response.status).toBe(200);
            expect(response.body.message).toMatch(/deleted/i);
        });

        test("should return 401 for invalid session", async () => {
            const response = await request(app)
                .delete(`/api/todos/${createdTaskId}`)
                .set("Cookie", "sessionId=invalid-session");
            expect(response.status).toBe(401);
        });

        test("should return 500 for deleting non-existent task", async () => {
            const response = await request(app)
                .delete(`/api/todos/nonexistentid`)
                .set("Cookie", `sessionId=${testSessionId}`);
            expect(response.status).toBe(500);
        });
    });
});
