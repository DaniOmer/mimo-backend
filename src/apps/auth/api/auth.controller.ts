import { NextFunction, Request, Response } from "express";
import { AuthService } from "../domain/auth.service";
import { Strategy } from "../domain/auth.factory";
import BadRequestError from "../../../config/error/bad.request.config";
import BaseController from "../../../librairies/controllers/base.controller";
import { ApiResponse } from "../../../librairies/controllers/api.response";

export class AuthController extends BaseController {
  readonly validStrategies: Strategy[];

  constructor() {
    super();
    this.validStrategies = ["basic", "social"];
  }

  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { strategy } = req.params;

    try {
      if (!strategy || !this.validStrategies.includes(strategy as Strategy)) {
        throw new BadRequestError({
          message: "Invalid authentication strategy",
          context: { strategy: `AuthStrategy` },
          logging: true,
        });
      }

      const userData = req.body;
      const authService = new AuthService(strategy as Strategy);
      const newUser = await authService.register(userData);
      this.logger.info(`User registered successfully: ${newUser.email}`);
      ApiResponse.success(res, "User registered successfully", newUser, 201);
    } catch (error: any) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { strategy } = req.params;

    try {
      if (!strategy || !this.validStrategies.includes(strategy as Strategy)) {
        throw new BadRequestError({
          message: "Invalid authentication strategy",
          context: { strategy: "AuthStrategy" },
        });
      }

      const userData = req.body;
      const authService = new AuthService(strategy as Strategy);
      const { token, ...user } = await authService.login(userData);
      this.logger.info(`User logged in successfully: ${user.email}`);
      ApiResponse.successWithToken(
        res,
        "User logged in successfully",
        user,
        token
      );
    } catch (error: any) {
      next(error);
    }
  }

  async requestPassswordReset(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { email } = req.body;

    try {
      const authService = new AuthService("basic");
      const success = await authService.requestPassswordReset(email);
      this.logger.info(`Reset password email sent to: ${email}`);
      ApiResponse.success(res, "Reset password email sent successfully", null);
    } catch (error: any) {
      next(error);
    }
  }

  async confirmPasswordReset(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const authService = new AuthService("basic");
      const updatedUser = await authService.confirmPasswordReset(req.body);
      this.logger.info(
        `Password updated successfully for user: ${updatedUser.email}`
      );
      ApiResponse.success(res, "Password updated successfully", null);
    } catch (error: any) {
      next(error);
    }
  }

  async updatePassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {}
}
