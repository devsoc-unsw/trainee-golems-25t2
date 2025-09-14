import request from "supertest";
import { app } from "../server";
import { prisma } from "../lib/prisma";

let testUserId: string;
let testSessionId = `test-dash-session-id-${Date.now()}`;

beforeAll(async () => {
  // Clean up any existing test data first
  await prisma.task.deleteMany({ where: { user: { email: { contains: "test-dash" } } } });
  await prisma.studySession.deleteMany({ where: { user: { email: { contains: "test-dash" } } } });
  await prisma.marketplaceItem.deleteMany({ where: { user: { email: { contains: "test-dash" } } } });
  await prisma.accommodation.deleteMany({ where: { user: { email: { contains: "test-dash" } } } });
  await prisma.note.deleteMany({ where: { user: { email: { contains: "test-dash" } } } });
  await prisma.session.deleteMany({ where: { user: { email: { contains: "test-dash" } } } });
  await prisma.user.deleteMany({ where: { email: { contains: "test-dash" } } });

  const user = await prisma.user.create({
    data: {
      email: `test-dash-${Date.now()}@example.com`,
      name: "Test Dashboard User",
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

  await prisma.accommodation.create({
    data: {
      userId: testUserId,
      name: "Apartment A",
      location: "1 Barker St",
      type: "apartment",
      status: "pending",
    },
  });

  await prisma.marketplaceItem.create({
    data: {
      userId: testUserId,
      title: "Sample Product",
      description: "Sample Description",
      status: "available",
      price: 50,
    },
  });

  await prisma.studySession.createMany({
    data: [
      {
        userId: testUserId,
        startTime: new Date(),
        endTime: new Date(),
      },
      {
        userId: testUserId,
        startTime: new Date(),
        endTime: new Date(),
      },
    ],
  });
});

afterAll(async () => {
  if (testUserId) {
    await prisma.task.deleteMany({ where: { userId: testUserId } });
    await prisma.studySession.deleteMany({ where: { userId: testUserId } });
    await prisma.marketplaceItem.deleteMany({ where: { userId: testUserId } });
    await prisma.accommodation.deleteMany({ where: { userId: testUserId } });
    await prisma.note.deleteMany({ where: { userId: testUserId } });
    await prisma.session.deleteMany({ where: { userId: testUserId } });
    await prisma.user.delete({ where: { id: testUserId } });
  }
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
    expect(body.username).toStrictEqual("Test Dashboard User");
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
    expect(body.accommodation_status).toStrictEqual({
      id: expect.any(String),
      name: "Apartment A",
      location: "1 Barker St",
      status: "pending",
    });
    expect(body.weekly_progress).toStrictEqual([
      {
        id: expect.any(String),
        startTime: expect.any(String),
        endTime: expect.any(String) 
      },
      {
        id: expect.any(String),
        startTime: expect.any(String),
        endTime: expect.any(String) 
      },
    ]);
  });
});
