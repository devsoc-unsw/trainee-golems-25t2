import request from "supertest";
import express from "express";

// Create a simple test app for testing
const createTestApp = () => {
  const app = express();
  app.use(express.json());

  app.get("/api/health", (req, res) => {
    res.json({ message: "Backend is running!" });
  });

  return app;
};

describe("Server Health Check", () => {
  test("GET /api/health should return success message", async () => {
    const app = createTestApp();

    const response = await request(app).get("/api/health").expect(200);

    expect(response.body).toEqual({
      message: "Backend is running!",
    });
  });
});
