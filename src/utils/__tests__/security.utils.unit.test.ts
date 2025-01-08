import { SecurityUtils } from "../security.utils";
import jwt from "jsonwebtoken";
import { AppConfig } from "../../config/app.config";
import BadRequestError from "../../config/error/bad.request.config";

jest.mock("../../config/app.config", () => ({
  AppConfig: {
    jwt: {
      secret: "mockSecret",
      expiresIn: "1h",
    },
    token: {
      defaultExpiresIn: 3600,
    },
  },
}));

describe("SecurityUtils", () => {
  describe("generateSecret", () => {
    it("should generate a random base64 string", () => {
      const secret = SecurityUtils.generateSecret();
      expect(typeof secret).toBe("string");
    });
  });

  describe("getJWTSecret", () => {
    it("should return the JWT secret from config", () => {
      const secret = SecurityUtils.getJWTSecret();
      expect(secret).toBe("mockSecret");
    });

    it("should throw BadRequestError if no secret in config", () => {
      (AppConfig.jwt as any).secret = "";
      expect(() => SecurityUtils.getJWTSecret()).toThrow(BadRequestError);
      (AppConfig.jwt as any).secret = "mockSecret";
    });
  });

  describe("hashPassword & comparePassword", () => {
    it("should correctly hash and compare a password", async () => {
      const password = "mySecret123!";
      const hash = await SecurityUtils.hashPassword(password);
      expect(hash).not.toBe(password);

      const isMatch = await SecurityUtils.comparePassword(password, hash);
      expect(isMatch).toBe(true);
    });
  });

  describe("generateJWTToken", () => {
    it("should generate a valid JWT token", async () => {
      const userData = {
        id: "user123",
        roles: [{ _id: "role1", name: "admin" }],
        permissions: [{ _id: "perm1", name: "READ" }],
      };
      const token = await SecurityUtils.generateJWTToken(userData);
      expect(typeof token).toBe("string");
      const decoded = jwt.verify(token, "mockSecret");
      expect(decoded).toHaveProperty("userId", "user123");
    });
  });

  describe("verifyJWTToken", () => {
    it("should return decoded payload if token is valid", async () => {
      const validToken = jwt.sign({ foo: "bar" }, "mockSecret", {
        expiresIn: "1h",
      });
      const decoded = await SecurityUtils.verifyJWTToken(validToken);
      expect(decoded).toHaveProperty("foo", "bar");
    });

    it("should throw BadRequestError if token is invalid", async () => {
      const invalidToken = "someInvalidToken";
      await expect(SecurityUtils.verifyJWTToken(invalidToken)).rejects.toThrow(
        BadRequestError
      );
    });
  });

  describe("generateRandomToken & validateToken", () => {
    it("should create a random token and validate it", async () => {
      const hashedToken = await SecurityUtils.generateRandomToken();
      expect(hashedToken).toMatch(/^\$2[aby]\$.{56}$/); 
    });
  });
});
