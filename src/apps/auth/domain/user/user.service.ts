import { IUser, UserRepository } from "../../data-access";
import { BaseService } from "../../../../librairies/services";
import BadRequestError from "../../../../config/error/bad.request.config";
import { UserUpdateDTO, PasswordUpdateDTO } from "./user.dto";
import { IRole, IPermission } from "../../data-access";
import { UserPermission, UserRole } from "../auth/auth.basic";
import { SecurityUtils } from "../../../../utils";

export class UserService extends BaseService {
  private repository: UserRepository;

  constructor() {
    super("User");
    this.repository = new UserRepository();
  }

  async getAllUsers(): Promise<Omit<IUser, "password">[]> {
    const users = await this.repository.getAll();
    return users.map((user) => {
      const { password, ...userWithoutPassword } = user.toObject();
      return userWithoutPassword;
    });
  }

  async getUserById(id: string): Promise<Omit<IUser, "password">> {
    const user = await this.repository.getUserById(id);
    if (!user) {
      throw new BadRequestError({
        message: "User not found",
        code: 404,
      });
    }
    const { password, ...userToDisplay } = user.toObject();
    const rolesWDate = this.getRolesWithoutDate(userToDisplay.roles);
    const permissionsWDate = this.getPermissionsWithoutDate(
      userToDisplay.permissions
    );

    return {
      ...userToDisplay,
      roles: rolesWDate,
      permissions: permissionsWDate,
    };
  }

  async updateUserById(
    id: string,
    updateData: UserUpdateDTO
  ): Promise<Omit<IUser, "password">> {
    const updatedUser = await this.repository.updateById(id, updateData);

    if (!updatedUser) {
      throw new BadRequestError({
        message: "User not found",
        code: 404,
      });
    }

    const { password, ...userWithoutPassword } = updatedUser.toObject();
    return userWithoutPassword;
  }

  async deleteUserById(id: string): Promise<IUser> {
    const deletedUser = await this.repository.deleteById(id);

    if (!deletedUser) {
      throw new BadRequestError({
        message: "User not found",
        code: 404,
      });
    }

    return deletedUser;
  }

  // THINK TO REFACTOR LATER (CF AUTH BASIC)
  getRolesWithoutDate(roles: IRole[]): UserRole[] {
    return roles.map((role: IRole) => {
      return {
        _id: role._id.toString(),
        name: role.name,
      };
    });
  }

  // THINK TO REFACTOR LATER (CF AUTH BASIC)
  getPermissionsWithoutDate(permissions: IPermission[]): UserPermission[] {
    return permissions.map((permission: IPermission) => {
      return {
        _id: permission._id.toString(),
        name: permission.name,
      };
    });
  }

  async changePassword(
    data: PasswordUpdateDTO,
    userId: string
  ): Promise<IUser> {
    const user = await this.repository.getById(userId);
    if (!user) {
      throw new BadRequestError({
        logging: true,
        context: { change_password: "User not found" },
      });
    }

    const isPasswordValid = await SecurityUtils.comparePassword(
      data.oldPassword,
      user.password
    );

    if (!isPasswordValid) {
      throw new BadRequestError({
        message: "Invalid old password",
        context: { change_password: "Invalid old password" },
        logging: true,
      });
    }

    const hashedPassword = await SecurityUtils.hashPassword(data.newPassword);
    const updatedUser = await this.repository.updateById(user._id, {
      password: hashedPassword,
    });

    if (!updatedUser) {
      throw new BadRequestError({
        logging: true,
        context: { change_password: "Failed to update password" },
        code: 500,
      });
    }
    return updatedUser;
  }
}
