import request from "supertest";
import { createTestServer } from "../../../../server.test";
import { DatabaseTestUtils } from "../../../../utils/database";

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
  await DatabaseTestUtils.seedPreferences();
});

afterAll(async () => {
  await DatabaseTestUtils.closeDatabase();
});

describe("Preference Routes", () => {
  describe("GET /preferences/:userId", () => {
    it("should retrieve user preferences", async () => {
      const userToken = await DatabaseTestUtils.getAuthToken(
        "user@example.com",
        "UserPassword123!"
      );
      const userId = await DatabaseTestUtils.getUserId("user@example.com");

      const response = await request(app)
        .get(`/preferences/${userId}`)
        .set("Authorization", `Bearer ${userToken}`);

      console.log("Response GET /preferences/:userId", response.body);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("preferences");
      expect(Array.isArray(response.body.preferences)).toBe(true);
    });

    it("should return 404 for non-existent user", async () => {
      const userToken = await DatabaseTestUtils.getAuthToken(
        "user@example.com",
        "UserPassword123!"
      );

      const response = await request(app)
        .get("/preferences/invalidUserId")
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("User not found");
    });
  });

  describe("PUT /preferences/:id", () => {
    it("should update user preferences", async () => {
      const userToken = await DatabaseTestUtils.getAuthToken(
        "user@example.com",
        "UserPassword123!"
      );
      const preferenceId = await DatabaseTestUtils.getPreferenceId(
        "user@example.com"
      );

      const preferencesPayload = { theme: "dark", notifications: true };

      const response = await request(app)
        .put(`/preferences/${preferenceId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send(preferencesPayload);

      console.log("Response PUT /preferences/:id", response.body);

      expect(response.status).toBe(200);
      expect(response.body.preferences).toMatchObject(preferencesPayload);
    });

    it("should return 400 for invalid preference payload", async () => {
      const userToken = await DatabaseTestUtils.getAuthToken(
        "user@example.com",
        "UserPassword123!"
      );
      const preferenceId = await DatabaseTestUtils.getPreferenceId(
        "user@example.com"
      );

      const invalidPayload = { invalidField: "value" };

      const response = await request(app)
        .put(`/preferences/${preferenceId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send(invalidPayload);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid preferences payload");
    });

    it("should return 404 for non-existent preference", async () => {
      const userToken = await DatabaseTestUtils.getAuthToken(
        "user@example.com",
        "UserPassword123!"
      );

      const response = await request(app)
        .put("/preferences/invalidPreferenceId")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ theme: "light" });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Preference not found");
    });
  });

  describe("DELETE /preferences/:id", () => {
    it("should delete a user preference", async () => {
      const adminToken = await DatabaseTestUtils.getAuthToken(
        "admin@example.com",
        "AdminPassword123!"
      );
      const preferenceId = await DatabaseTestUtils.getPreferenceId(
        "user@example.com"
      );

      const response = await request(app)
        .delete(`/preferences/${preferenceId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(204);
    });

    it("should return 403 for unauthorized role", async () => {
      const userToken = await DatabaseTestUtils.getAuthToken(
        "user@example.com",
        "UserPassword123!"
      );
      const preferenceId = await DatabaseTestUtils.getPreferenceId(
        "user@example.com"
      );

      const response = await request(app)
        .delete(`/preferences/${preferenceId}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe("Forbidden");
    });

    it("should return 404 for non-existent preference", async () => {
      const adminToken = await DatabaseTestUtils.getAuthToken(
        "admin@example.com",
        "AdminPassword123!"
      );

      const response = await request(app)
        .delete("/preferences/invalidPreferenceId")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Preference not found");
    });
  });
});
