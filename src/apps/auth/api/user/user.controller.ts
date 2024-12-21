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
      const updateData = this.dataToDtoInstance(req.body, UserUpdateDTO);
      const updatedUser = await this.userService.updateUserById(id, updateData);
      ApiResponse.success(res, "User updated successfully", updatedUser, 200);
    } catch (error) {
      next(error);
    }
  }

  async deleteUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await this.userService.deleteUserById(id);
      ApiResponse.success(res, "User deleted successfully", null, 200);
    } catch (error) {
      next(error);
    }
  }

  async createInvitation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
       const { firstName, lastName, email, adminId, role } = req.body;
       await this.userService.createInvitation(firstName, lastName, email, adminId, role);
       ApiResponse.success(res, "Invitation created successfully and email sent", null, 201);
    } catch (error) {
       next(error);

    }
 }
 
  async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { password, isTermsOfSale,tokenHash } = req.body;
        const newUser = await this.userService.createUser(tokenHash as string, { password, isTermsOfSale });
        ApiResponse.success(res, "User registered successfully", newUser, 201);
    } catch (error) {
        next(error);
  }
}

}
