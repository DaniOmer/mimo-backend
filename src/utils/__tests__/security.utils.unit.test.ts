import { SecurityUtils, UserDataToJWT } from "../security.utils";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AppConfig } from "../../config/app.config";
import BadRequestError from "../../config/error/bad.request.config";
import bcrypt from "bcrypt";

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
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("generateSecret", () => {
    it("should generate a random base64 string of appropriate length", () => {
      const secret = SecurityUtils.generateSecret();
      expect(typeof secret).toBe("string");
      expect(secret).toHaveLength(44);
    });
  });

  describe("getJWTSecret", () => {
    it("should return the JWT secret from config", () => {
      const secret = SecurityUtils.getJWTSecret();
      expect(secret).toBe("mockSecret");
    });

    it("should throw BadRequestError if no secret in config", () => {
      const originalSecret = AppConfig.jwt.secret;
      (AppConfig.jwt as any).secret = "";
      expect(() => SecurityUtils.getJWTSecret()).toThrow(BadRequestError);
      (AppConfig.jwt as any).secret = originalSecret;
    });
  });

  describe("hashPassword & comparePassword", () => {
    it("should correctly hash and compare a password", async () => {
      const password = "mySecret123!";
      const hash = await SecurityUtils.hashPassword(password);
      expect(hash).not.toBe(password);
      expect(hash).toMatch(/^\$2[aby]\$.{56}$/); // bcrypt hash pattern

      const isMatch = await SecurityUtils.comparePassword(password, hash);
      expect(isMatch).toBe(true);
    });

    it("should return false for incorrect password comparison", async () => {
      const password = "mySecret123!";
      const wrongPassword = "wrongPassword!";
      const hash = await SecurityUtils.hashPassword(password);

      const isMatch = await SecurityUtils.comparePassword(wrongPassword, hash);
      expect(isMatch).toBe(false);
    });
  });

  describe("verifyJWTToken", () => {
    it("should return decoded payload if token is valid", async () => {
      const payload = { foo: "bar" };
      const validToken = jwt.sign(payload, "mockSecret", { expiresIn: "1h" });

      const decoded = await SecurityUtils.verifyJWTToken(validToken);
      expect(decoded).toMatchObject(payload);
    });

    it("should throw BadRequestError if token is invalid", async () => {
      const invalidToken = "someInvalidToken";
      await expect(SecurityUtils.verifyJWTToken(invalidToken)).rejects.toThrow(BadRequestError);
    });

    it("should throw BadRequestError if JWT secret is missing", async () => {
      const originalSecret = AppConfig.jwt.secret as string;
      (AppConfig.jwt as any).secret = undefined;

      const validToken = jwt.sign({ foo: "bar" }, originalSecret, { expiresIn: "1h" });

      await expect(SecurityUtils.verifyJWTToken(validToken)).rejects.toThrow(BadRequestError);

      (AppConfig.jwt as any).secret = originalSecret;
    });
  });

  describe("generateRandomToken & validateToken", () => {
    it("should create a random token and validate it", async () => {
      const hashedTokenPromise = SecurityUtils.generateRandomToken();
      const hashedToken = await hashedTokenPromise;
      expect(hashedToken).toMatch(/^\$2[aby]\$.{56}$/); 

      const mockToken = "randomToken123";
      const mockHashedToken = await SecurityUtils.hashPassword(mockToken);
      jest.spyOn(SecurityUtils, "generateRandomToken").mockResolvedValue(mockHashedToken);

      const newHashedToken = await SecurityUtils.generateRandomToken();
      expect(newHashedToken).toBe(mockHashedToken);

      const isValid = await SecurityUtils.validateToken(mockToken, mockHashedToken);
      expect(isValid).toBe(true);
    });
  });

  describe("isOwnerOrAdmin", () => {
    it("should return true if the current user is the owner", () => {
      const resourceUserId = "user123";
      const currentUser: UserDataToJWT = {
        _id: "user123",
        id: new (require("mongoose").Types.ObjectId)(),
        roles: [{ name: "user" }],
        permissions: [{ name: "READ" }],
      };

      const result = SecurityUtils.isOwnerOrAdmin(resourceUserId, currentUser);
      expect(result).toBe(true);
    });

    it("should return true if the current user is an admin", () => {
      const resourceUserId = "user123";
      const currentUser: UserDataToJWT = {
        _id: "admin456",
        id: new (require("mongoose").Types.ObjectId)(),
        roles: [{ name: "admin" }],
        permissions: [{ name: "READ" }, { name: "WRITE" }],
      };

      const result = SecurityUtils.isOwnerOrAdmin(resourceUserId, currentUser);
      expect(result).toBe(true);
    });

    it("should return false if the current user is neither the owner nor an admin", () => {
      const resourceUserId = "user123";
      const currentUser: UserDataToJWT = {
        _id: "user456",
        id: new (require("mongoose").Types.ObjectId)(),
        roles: [{ name: "user" }],
        permissions: [{ name: "READ" }],
      };

      const result = SecurityUtils.isOwnerOrAdmin(resourceUserId, currentUser);
      expect(result).toBe(false);
    });
  });
});
