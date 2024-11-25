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

  async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { id } = req.params;
        const user = await this.userService.getUserById(id);
        if (!user) {
          return ApiResponse.error(res, "User not found", 404, { userId: id });
        }
        ApiResponse.success(res, "User fetched successfully", user);
    } catch (error) {
        next(error); 
    }
}

async updateUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedUser = await this.userService.updateUserById(id, updateData);

    if (!updatedUser) {
      return ApiResponse.error(res, "User not found", 404, { userId: id });
    }

    ApiResponse.success(res, "User updated successfully", updatedUser);
  } catch (error) {
    next(error);
  }
}

async deleteUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params; 
    const isDeleted = await this.userService.deleteUserById(id);

    if (!isDeleted) {
      return ApiResponse.error(res, "User not found", 404);
    }

    this.logger.info(`User with ID ${id} deleted successfully`);
    ApiResponse.success(res, "User deleted successfully", null, 204);
  } catch (error) {
    next(error); 
  }
}
}
