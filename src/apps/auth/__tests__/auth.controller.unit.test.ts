import BadRequestError from "../../../config/error/bad.request.config";
import { AuthController } from "../api";
import { Request, Response, NextFunction } from "express";
import { AuthService } from "../domain";

jest.mock("../domain/auth/auth.service.ts");

describe("AuthController", () => {
  let authController: AuthController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    authController = new AuthController();
    req = {
      params: {},
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe("register", () => {
    it("should throw BadRequestError if strategy is invalid", async () => {
      req.params = { strategy: "invalid" };
      await authController.register(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
    });

    it("should call AuthService.register with correct data", async () => {
      const mockRegister = jest
        .fn()
        .mockResolvedValue({ email: "test@example.com" });
      (AuthService as jest.Mock).mockImplementation(() => ({
        register: mockRegister,
      }));

      req.params = { strategy: "basic" };
      req.body = { email: "test@example.com", password: "password123" };

      await authController.register(req as Request, res as Response, next);

      expect(mockRegister).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "User registered successfully" })
      );
    });

    it("should handle errors and call next with the error", async () => {
      const error = new Error("Service failure");
      (AuthService as jest.Mock).mockImplementation(() => ({
        register: jest.fn().mockRejectedValue(error),
      }));

      req.params = { strategy: "basic" };
      req.body = { email: "test@example.com" };

      await authController.register(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
