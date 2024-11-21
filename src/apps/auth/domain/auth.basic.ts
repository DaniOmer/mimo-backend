import { AuthStrategy } from "./auth.strategy";
import { IUser } from "../data-access/user.interface";
import { UserRepository } from "../data-access/user.repository";
import { SecurityUtils } from "../../../utils/security.utils";
import BadRequestError from "../../../config/error/bad.request.config";

export type UserCreate = Omit<IUser, "_id" | "createdAt" | "updatedAt">;
export type UserResponse = Omit<IUser, "password">;

export class BasicAuthStrategy implements AuthStrategy {
  readonly userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(userData: UserCreate): Promise<UserResponse> {
    const existingUser = await this.userRepository.getByEmail(userData.email);
    if (existingUser) {
      throw new BadRequestError({
        message: "Email already exists",
        context: { field_validation: ["email"] },
        logging: true,
      });
    }

    const hashedPassword = await SecurityUtils.hashPassword(userData.password);
    const newUser = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });
    const userObject = newUser.toObject();
    delete userObject.password;
    return userObject;
  }

  async login(data: any): Promise<any> {
    throw new Error("This strategy is not implemented yet");
  }
}
