import { NextFunction, Request, Response } from "express";
import { AuthService } from "../domain/auth.service";
import { Strategy } from "../domain/auth.factory";
import BadRequestError from "../../../config/error/bad.request.config";
import BaseController from "../../../librairies/controllers/base.controller";

export class AuthController extends BaseController {
  constructor() {
    super();
  }

  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { strategy } = req.params;
    const validStrategies: Strategy[] = ["basic", "social"];

    try {
      if (!strategy || !validStrategies.includes(strategy as Strategy)) {
        throw new BadRequestError({
          message: "Invalid authentication strategy",
          context: { strategy: "AuthStrategy" },
        });
      }

      const userData = req.body;
      const authService = new AuthService(strategy as Strategy);
      const newUser = await authService.register(userData);
      this.logger.info(`User registered successfully: ${newUser.email}`);
      res.status(201).json(newUser);
    } catch (error: any) {
      next(error);
    }
  }
}
