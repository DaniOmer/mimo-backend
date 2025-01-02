import { Request, Response, NextFunction } from "express";
import { UserService } from "../../domain/user/user.service";
import { ApiResponse } from "../../../../librairies/controllers/api.response";
import { BaseController } from "../../../../librairies/controllers";
import { UserUpdateDTO } from "../../domain";

export class UserController extends BaseController {
  private userService: UserService;

  constructor() {
    super();
    this.userService = new UserService();
  }

  async getAllUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const users = await this.userService.getAllUsers();
      ApiResponse.success(res, "Users retrieved successfully", users, 200);
    } catch (error) {
      next(error);
    }
  }

  async getUserById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(id);
      ApiResponse.success(res, "User retrieved successfully", user, 200);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = this.dataToDtoInstance(req.body, UserUpdateDTO);
      const updatedUser = await this.userService.updateUserById(id, updateData);
      ApiResponse.success(res, "User updated successfully", updatedUser, 200);
    } catch (error) {
      next(error);
    }
  }

  async deleteUserById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      await this.userService.deleteUserById(id);
      ApiResponse.success(res, "User deleted successfully", null, 200);
    } catch (error) {
      next(error);
    }
  }

  async updatePassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const currentUser = req.user;
      const data = req.body;
      const updatedUser = await this.userService.changePassword(
        data,
        currentUser._id
      );
      this.logger.info(
        `Password updated successfully for user: ${updatedUser.email}`
      );
      ApiResponse.success(res, "Password updated successfully", null);
    } catch (error: any) {
      next(error);
    }
  }
}
