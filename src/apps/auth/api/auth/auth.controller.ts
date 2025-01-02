import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../../../../librairies/controllers/api.response";
import { Strategy, AuthService } from "../../domain";
import BadRequestError from "../../../../config/error/bad.request.config";
import { BaseController } from "../../../../librairies/controllers";

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
    const userData = req.body;

    try {
      if (!strategy || !this.validStrategies.includes(strategy as Strategy)) {
        throw new BadRequestError({
          message: "Invalid authentication strategy",
          context: { strategy: `AuthStrategy` },
          logging: true,
        });
      }
      const authService = new AuthService(strategy as Strategy);
      const createdUser = await authService.register(userData);
      this.logger.info(`User registered successfully: ${createdUser.email}`);
      ApiResponse.success(
        res,
        "User registered successfully",
        createdUser,
        201
      );
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

  async requestEmailConfirmation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { token } = req.body;
      const authService = new AuthService("basic");
      await authService.confirmEmailRequest(token);
      ApiResponse.success(res, "Email successfully verified", null);
    } catch (error) {
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
      const resetPasswordLink = await authService.requestPassswordReset(email);
      this.logger.info(
        `Reset password email sent to: ${email} - Reset link is ${resetPasswordLink}`
      );
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
}
