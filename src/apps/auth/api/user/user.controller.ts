import { Request, Response, NextFunction } from "express";
import { UserService } from "../../domain/user/user.service";
import { InvitationService } from "../../domain/invitation/invitation.service";
import { ApiResponse } from "../../../../librairies/controllers/api.response";
import { BaseController } from "../../../../librairies/controllers";
import { UserUpdateDTO } from "../../domain";

export class UserController extends BaseController {
  private userService: UserService;
  invitationService: InvitationService;

  constructor() {
    super();
    this.userService = new UserService();
    this.invitationService = new InvitationService();
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
      const user = await this.userService.getUserById(id, req.user);
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

  
  async createUserFromInvitation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { tokenHash, password, isTermsOfSale } = req.body;

      const newUser = await this.userService.createUserFromInvitation(
        tokenHash,
        password,
        isTermsOfSale,
        this.invitationService 
      );

      ApiResponse.success(res, "User registered successfully", newUser, 201);
    } catch (error) {
      next(error);
    }
  }


  async toggleUserStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { isDisabled } = req.body; // Booléen attendu dans le corps de la requête
      const updatedUser = await this.userService.toggleUserStatus(id, isDisabled);
      ApiResponse.success(res, "User status updated successfully", updatedUser, 200);
    } catch (error) {
      next(error);
    }
  }

  async deleteMultipleUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { ids } = req.body; 
      const deletedUserIds = await this.userService.deleteMultipleUsers(ids);
      ApiResponse.success(res, "Users deleted successfully", deletedUserIds, 200);
    } catch (error) {
      next(error);
    }
  }
  
  async disableMultipleUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { ids, isDisabled } = req.body; 
      const updatedUsers = await this.userService.disableMultipleUsers(ids, isDisabled);
      ApiResponse.success(res, "Users status updated successfully", updatedUsers, 200);
    } catch (error) {
      next(error);
    }
  }
  
  
}
