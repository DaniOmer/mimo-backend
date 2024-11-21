import { Request, Response } from "express";
import { UserService } from "../domain/user.service";

export class UserController {
  readonly userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async register(req: Request, res: Response): Promise<void> {
    const userData = req.body;

    try {
      const newUser = await this.userService.register(userData);
      res.status(201).json(newUser);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
