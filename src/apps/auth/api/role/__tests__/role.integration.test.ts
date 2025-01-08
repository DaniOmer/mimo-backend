// src/apps/auth/api/role/__tests__/role.integration.test.ts
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

describe("Role Routes", () => {
  describe("POST /api/roles", () => {
    it("should create a new role", async () => {
      const adminToken = await DatabaseTestUtils.getAuthToken(
        "admin@example.com",
        "Azerty1234567!"
      );

      const response = await request(app)
        .post("/api/roles")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "editor" });

      console.log("Response POST /api/roles", response.body);

      expect(response.status).toBe(201);
      expect(response.body.data.name).toBe("editor");
    });
  });
});
