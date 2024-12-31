// src/apps/auth/api/auth/__tests__/auth.integration.test.ts
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

describe("Auth Routes", () => {
  describe("POST /api/auth/register/:strategy", () => {
    it("should register a new user with basic strategy", async () => {
      const response = await request(app)
        .post("/api/auth/register/basic")
        .send({
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          password: "Azerty1234567!",
          roles: ["user"],
          isTermsOfSale: true,
          authType: "basic",
        });


      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty("email", "john.doe@example.com");
    });

    it("should return 400 for invalid strategy", async () => {
      const response = await request(app)
        .post("/api/auth/register/invalid")
        .send({
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          password: "Azerty1234567!",
          roles: ["user"],
          isTermsOfSale: true,
          authType: "basic",
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid authentication strategy");
    });
  });

  describe("POST /api/auth/login/:strategy", () => {
    it("should login a user successfully", async () => {
      const response = await request(app)
        .post("/api/auth/login/basic")
        .send({
          email: "admin@example.com",
          password: "Azerty1234567!",
        });


      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
    });

    it("should return 401 for invalid credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login/basic")
        .send({
          email: "admin@example.com",
          password: "WrongPassword123!",
        });

      console.log("Response POST /api/auth/login/basic", response.body);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid credentials");
    });
  });
});
