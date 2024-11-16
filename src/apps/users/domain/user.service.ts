import { IUser } from "../data-access/user.schema";
import { UserModel } from "../data-access/user.model";
import { UserRepository } from "../data-access/user.repository";

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
    const newUser = new UserModel(userData);
    await this.userRepository.create(newUser);
    return newUser;
  }
}
