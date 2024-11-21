import { NextFunction, Request, Response } from "express";
import { AuthService } from "../domain/auth.service";
import { Logger } from "winston";
import { LoggerConfig } from "../../../config/logger/logger.config";
import { Strategy } from "../domain/auth.factory";
import BadRequestError from "../../../config/error/bad.request.config";

export class AuthController {
  private logger: Logger;

  constructor() {
    this.logger = LoggerConfig.get().logger;
  }

  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { strategy } = req.params;
    const validStrategies: Strategy[] = ["basic", "social"];

    if (!strategy || !validStrategies.includes(strategy as Strategy)) {
      throw new BadRequestError({
        message: "Invalid authentication strategy",
        logging: true,
        context: { strategy: "AuthStrategy" },
      });
    }

    try {
      const userData = req.body;
      const authService = new AuthService(strategy as Strategy);
      const newUser = await authService.register(userData);
      this.logger.info(`User registered: ${newUser.email}`);
      res.status(201).json(newUser);
    } catch (error: any) {
      next(error);
    }
  }
}
