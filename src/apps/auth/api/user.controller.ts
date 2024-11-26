import { Request, Response, NextFunction } from "express";
import { UserService } from "../domain/user.service";
import { ApiResponse } from "../../../librairies/controllers/api.response";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await this.userService.getAllUsers();
      ApiResponse.success(res, "Users retrieved successfully", users, 200);
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(id);
      ApiResponse.success(res, "User retrieved successfully", user, 200);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params; 
      const updateData = req.body; 
  
      const updatedUser = await this.userService.updateUserById(id, updateData);
  
      ApiResponse.success(res, "User updated successfully", updatedUser, 200);
    } catch (error) {
      next(error); 
    }
  }
  

}
