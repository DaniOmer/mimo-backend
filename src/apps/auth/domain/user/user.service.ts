import { IUser, UserRepository } from "../../data-access";
import { BaseService } from "../../../../librairies/services";
import BadRequestError from "../../../../config/error/bad.request.config";
import { UserUpdateDTO } from "./user.dto";

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
    const user = await this.repository.getById(id);
    if (!user) {
      throw new BadRequestError({
        message: "User not found",
        code: 404,
      });
    }
    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
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
}
