import { NextFunction, Request, Response } from "express";
import BaseController from "../../../librairies/controllers/base.controller";
import { ApiResponse } from "../../../librairies/controllers/api.response";
import { UserService } from "../domain/user.service";

export class UserController extends BaseController {
  private userService: UserService;

  constructor() {
    super();
    this.userService = new UserService(); 
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await this.userService.getAllUsers(); 
      this.logger.info(`Fetched ${users.length} users`); 
      ApiResponse.success(res, "Users fetched successfully", users); 
    } catch (error: any) {
      next(error); 
    }
  }
}
