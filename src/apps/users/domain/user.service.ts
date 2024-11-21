import { IUser } from "../data-access/user.interface";
import { UserRepository } from "../data-access/user.repository";
import { SecurityUtils } from "../../../utils/security.utils";

export type UserCreate = Omit<IUser, "_id" | "createdAt" | "updatedAt">;

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(userData: UserCreate) {
    const existingUser = await this.userRepository.getByEmail(userData.email);
    if (existingUser) {
      throw new Error("A user with the same email already exists");
    }
    const newUser = await this.userRepository.create({
      ...userData,
      password: SecurityUtils.sha512(userData.password),
    });
    const userObject = newUser.toObject();
    delete userObject.password;
    return userObject;
  }
}
