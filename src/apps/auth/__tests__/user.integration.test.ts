import request from "supertest";
import { createTestServer } from "../../../server.test";
import { DatabaseTestUtils } from "../../../utils/database";

let app: ReturnType<typeof createTestServer>;

beforeAll(async () => {
  await DatabaseTestUtils.initDatabase();
  app = createTestServer();
});

beforeEach(async () => {
  console.log("Cleaning up database...");
  await DatabaseTestUtils.cleanupDatabase();
  console.log("Seeding database...");
  await DatabaseTestUtils.seedUsers();
});

afterAll(async () => {
  await DatabaseTestUtils.closeDatabase();
});

describe("User Routes", () => {
  describe("GET /api/users", () => {
    it("should retrieve all users", async () => {
      const response = await request(app).get("/api/users");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe("GET /api/users/:id", () => {
    it("should retrieve a user by ID", async () => {
      const userId = await DatabaseTestUtils.getUserId("admin@example.com");
      const adminToken = await DatabaseTestUtils.getAuthToken(
        "admin@example.com",
        "Azerty1234567!"
      );

      const response = await request(app)
        .get(`/api/users/${userId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data._id).toBe(userId);
    });
  });
});
