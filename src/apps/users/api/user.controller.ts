import { Request, Response } from "express";
import { UserService } from "../domain/user.service";
import { Logger } from "winston";
import { LoggerConfig } from "../../../config/logger/logger.config";

export class UserController {
  readonly userService: UserService;
  private logger: Logger;

  constructor() {
    this.userService = new UserService();
    this.logger = LoggerConfig.get().logger;
  }

  async register(req: Request, res: Response): Promise<void> {
    const userData = req.body;

    try {
      const newUser = await this.userService.register(userData);
      this.logger.info(`User registered: ${newUser.email}`);
      res.status(201).json(newUser);
    } catch (error: any) {
      this.logger.error(`Error registering user: ${error.message}`);
      res.status(400).json({ message: error.message });
    }
  }
}
