import request from "supertest";
import { app } from "../server";
import { prisma } from "../lib/prisma";

let testUserId: string;
let testSessionId = "test-session-id";

beforeAll(async () => {
  const user = await prisma.user.create({
    data: {
      email: "test@example.com",
      name: "Test User",
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

  await prisma.note.createMany({
    data: [
      {
        userId: testUserId,
        title: "Title 1",
        content: "Content 1",
      },
      {
        userId: testUserId,
        title: "Title 2",
        content: "Content 2",
      },
      {
        userId: testUserId,
        title: "Title 3",
        content: "Content 3",
      },
      {
        userId: testUserId,
        title: "Title 4",
        content: "Content 4",
      },
    ],
  });
});

afterAll(async () => {
  await prisma.user.delete({ where: { id: testUserId } });
  await prisma.session.deleteMany({ where: { userId: testUserId } });
  await prisma.note.deleteMany({ where: { userId: testUserId } });
  await prisma.$disconnect();
});

describe("dashboard summary endpoint", () => {
  test("invalid sessionid", async () => {
    const response = await request(app)
      .get("/api/dashboard/summary")
      .set("Cookie", "sessionId=invalid-session-id");
    expect(response.status).toBe(401);
  });

  test("correct return", async () => {
    const response = await request(app)
      .get("/api/dashboard/summary")
      .set("Cookie", `sessionId=${testSessionId}`);
    expect(response.status).toBe(200);

    const body = response.body;
    expect(body.greeting).toStrictEqual(expect.any(String));
    expect(body.username).toStrictEqual("Test User");
    expect(body.recent_notes).toStrictEqual([
      {
        id: expect.any(String),
        title: "Title 1",
        content: "Content 1",
        updatedAt: expect.any(String),
      },
      {
        id: expect.any(String),
        title: "Title 2",
        content: "Content 2",
        updatedAt: expect.any(String),
      },
      {
        id: expect.any(String),
        title: "Title 3",
        content: "Content 3",
        updatedAt: expect.any(String),
      },
    ]);
  });
});
