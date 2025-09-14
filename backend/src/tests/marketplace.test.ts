import {
  requestCreateMarketplaceItem,
  requestGetAllMarketplaceItems,
  requestGetUserMarketplaceItems,
  requestGetRecommendedMarketplaceItems,
  requestGetMarketplaceItemById,
  requestUpdateMarketplaceItem,
  requestDeleteMarketplaceItem,
  requestClear,
} from "./marketplace.wrapper";
import { prisma } from "../lib/prisma";

const MARKETPLACE_ITEM = {
  id: expect.any(String),
  title: expect.any(String),
  description: expect.any(String),
  price: expect.any(Number),
  status: expect.any(String),
  userId: expect.any(String),
  createdAt: expect.any(String),
  updatedAt: expect.any(String),
  user: {
    id: expect.any(String),
    name: expect.any(String),
    email: expect.any(String),
  },
};

const ERROR = { error: expect.any(String) };

describe("Marketplace API Tests", () => {
  let user1Id: string;
  let user2Id: string;

  beforeAll(async () => {
    // Create test users
    const user1 = await prisma.user.create({
      data: {
        email: `user1-${Date.now()}@example.com`,
        name: "Test User 1",
        password: "Password123!",
      },
    });
    user1Id = user1.id;

    const user2 = await prisma.user.create({
      data: {
        email: `user2-${Date.now()}@example.com`,
        name: "Test User 2", 
        password: "Password123!",
      },
    });
    user2Id = user2.id;
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.marketplaceItem.deleteMany({ where: { userId: { in: [user1Id, user2Id] } } });
    await prisma.user.deleteMany({ where: { id: { in: [user1Id, user2Id] } } });
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await requestClear();
    // Clean up marketplace items between tests
    await prisma.marketplaceItem.deleteMany({ where: { userId: { in: [user1Id, user2Id] } } });
  });

  describe("POST /api/marketplace - Create marketplace item", () => {
    it("Successfully create marketplace item", async () => {
      const response = await requestCreateMarketplaceItem(
        user1Id,
        "Used Textbook",
        "Calculus textbook in good condition",
        25
      );

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(MARKETPLACE_ITEM);
      expect(response.body.title).toBe("Used Textbook");
      expect(response.body.description).toBe("Calculus textbook in good condition");
      expect(response.body.price).toBe(25);
      expect(response.body.userId).toBe(user1Id);
    });

    it("Fail to create item with empty title", async () => {
      const response = await requestCreateMarketplaceItem(
        user1Id,
        "",
        "Description",
        25
      );

      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual(ERROR);
    });

    it("Fail to create item with empty description", async () => {
      const response = await requestCreateMarketplaceItem(
        user1Id,
        "Title",
        "",
        25
      );

      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual(ERROR);
    });

    it("Fail to create item with negative price", async () => {
      const response = await requestCreateMarketplaceItem(
        user1Id,
        "Title",
        "Description",
        -5
      );

      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual(ERROR);
    });

    it("Fail to create item with price too high", async () => {
      const response = await requestCreateMarketplaceItem(
        user1Id,
        "Title",
        "Description",
        1000000
      );

      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual(ERROR);
    });

    it("Fail to create item with title too long", async () => {
      const response = await requestCreateMarketplaceItem(
        user1Id,
        "A".repeat(201),
        "Description",
        25
      );

      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual(ERROR);
    });
  });

  describe("GET /api/marketplace - Get all marketplace items", () => {
    it("Successfully get all marketplace items", async () => {
      // Create test items first
      await requestCreateMarketplaceItem(user1Id, "Item 1", "Description 1", 10);
      await requestCreateMarketplaceItem(user2Id, "Item 2", "Description 2", 20);

      const response = await requestGetAllMarketplaceItems();

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body[0]).toMatchObject(MARKETPLACE_ITEM);
    });

    it("Get empty array when no items exist", async () => {
      const response = await requestGetAllMarketplaceItems();

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe("GET /api/marketplace/user/:userId - Get user's marketplace items", () => {
    it("Successfully get user's items", async () => {
      await requestCreateMarketplaceItem(user1Id, "User 1 Item", "Description", 15);
      await requestCreateMarketplaceItem(user2Id, "User 2 Item", "Description", 25);

      const response = await requestGetUserMarketplaceItems(user1Id);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].title).toBe("User 1 Item");
      expect(response.body[0].userId).toBe(user1Id);
    });

    it("Get empty array for user with no items", async () => {
      const response = await requestGetUserMarketplaceItems("nonexistent");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe("GET /api/marketplace/recommended/:userId - Get recommended items", () => {
    it("Successfully get recommended items (excluding user's own)", async () => {
      await requestCreateMarketplaceItem(user1Id, "User 1 Item", "Description", 15);
      await requestCreateMarketplaceItem(user2Id, "User 2 Item", "Description", 25);

      const response = await requestGetRecommendedMarketplaceItems(user1Id);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].title).toBe("User 2 Item");
      expect(response.body[0].userId).toBe(user2Id);
    });
  });

  describe("GET /api/marketplace/:id - Get marketplace item by ID", () => {
    it("Successfully get item by ID", async () => {
      const createResponse = await requestCreateMarketplaceItem(user1Id, "Test Item", "Description", 30);
      const itemId = createResponse.body.id;

      const response = await requestGetMarketplaceItemById(itemId);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(MARKETPLACE_ITEM);
      expect(response.body.id).toBe(itemId);
    });

    it("Fail to get non-existent item", async () => {
      const response = await requestGetMarketplaceItemById("nonexistent");

      expect(response.status).toBe(404);
      expect(response.body).toStrictEqual(ERROR);
    });
  });

  describe("PUT /api/marketplace/:id - Update marketplace item", () => {
    it("Successfully update marketplace item", async () => {
      const createResponse = await requestCreateMarketplaceItem(user1Id, "Original Title", "Original Description", 30);
      const itemId = createResponse.body.id;

      const response = await requestUpdateMarketplaceItem(
        itemId,
        "Updated Title",
        "Updated Description",
        35,
        "sold"
      );

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(MARKETPLACE_ITEM);
      expect(response.body.title).toBe("Updated Title");
      expect(response.body.description).toBe("Updated Description");
      expect(response.body.price).toBe(35);
      expect(response.body.status).toBe("sold");
    });

    it("Fail to update non-existent item", async () => {
      const response = await requestUpdateMarketplaceItem(
        "nonexistent",
        "Title",
        "Description",
        25
      );

      expect(response.status).toBe(404);
      expect(response.body).toStrictEqual(ERROR);
    });

    it("Fail to update with invalid data", async () => {
      const createResponse = await requestCreateMarketplaceItem(user1Id, "Original Title", "Original Description", 30);
      const itemId = createResponse.body.id;

      const response = await requestUpdateMarketplaceItem(
        itemId,
        "", // Invalid empty title
        "Description",
        25
      );

      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual(ERROR);
    });
  });

  describe("DELETE /api/marketplace/:id - Delete marketplace item", () => {
    it("Successfully delete marketplace item", async () => {
      const createResponse = await requestCreateMarketplaceItem(user1Id, "To Delete", "Description", 20);
      const itemId = createResponse.body.id;

      const response = await requestDeleteMarketplaceItem(itemId);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ 
        message: "Marketplace item deleted successfully" 
      });

      // Verify item is actually deleted
      const getResponse = await requestGetMarketplaceItemById(itemId);
      expect(getResponse.status).toBe(404);
    });

    it("Fail to delete non-existent item", async () => {
      const response = await requestDeleteMarketplaceItem("nonexistent");

      expect(response.status).toBe(404);
      expect(response.body).toStrictEqual(ERROR);
    });
  });
});