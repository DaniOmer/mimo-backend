import { Request, Response } from "express";
import { AuthService } from "../domain/auth.service";
import { Logger } from "winston";
import { LoggerConfig } from "../../../config/logger/logger.config";
import { Strategy } from "../domain/auth.factory";

export class UserController {
  private logger: Logger;

  constructor() {
    this.logger = LoggerConfig.get().logger;
  }

  async register(req: Request, res: Response): Promise<void> {
    const { strategy } = req.params;
    const validStrategies: Strategy[] = ["basic", "social"];

    if (!strategy || !validStrategies.includes(strategy as Strategy)) {
      this.logger.error(`Invalid authentication strategy: ${strategy}`);
      res.status(400).json({ message: "Invalid authentication strategy" });
      return;
    }

    try {
      const userData = req.body;

      const authService = new AuthService(strategy as Strategy);
      const newUser = await authService.register(userData);
      this.logger.info(`User registered: ${newUser.email}`);
      res.status(201).json(newUser);
    } catch (error: any) {
      this.logger.error(`Error registering user: ${error.message}`);
      res.status(400).json({ message: error.message });
    }
  }
}
