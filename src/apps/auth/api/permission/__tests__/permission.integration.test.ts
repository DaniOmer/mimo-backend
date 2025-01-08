// src/apps/auth/api/permission/__tests__/permission.integration.test.ts
import request from "supertest";
import { createTestServer } from "../../../../../server.test";
import { DatabaseTestUtils } from "../../../../../utils/database";

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

describe("Permission Routes", () => {
  describe("POST /api/permissions", () => {
    it("should create a new permission", async () => {
      const adminToken = await DatabaseTestUtils.getAuthToken(
        "admin@example.com",
        "Azerty1234567!" 
      );

      const response = await request(app)
        .post("/api/permissions")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "MANAGE_USERS" });

      console.log("Response POST /api/permissions", response.body);

      expect(response.status).toBe(201);
      expect(response.body.data.name).toBe("MANAGE_USERS");
    });
  });
});
