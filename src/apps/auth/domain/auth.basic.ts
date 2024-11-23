import { AuthStrategy } from "./auth.strategy";
import { IUser } from "../data-access/user.interface";
import { UserRepository } from "../data-access/user.repository";
import { SecurityUtils } from "../../../utils/security.utils";
import BadRequestError from "../../../config/error/bad.request.config";

export type UserCreate = Omit<IUser, "_id" | "createdAt" | "updatedAt">;
export type UserAuthenticate = Pick<IUser, "email" | "password">;
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

  async authenticate(userData: UserAuthenticate): Promise<UserResponse> {
    const user = await this.userRepository.getByEmail(userData.email);
    if (!user) {
      throw new BadRequestError({
        code: 404,
        message: "User not found",
        context: { authentication: "User not found" },
        logging: true,
      });
    }

    const isPasswordValid = await SecurityUtils.comparePassword(
      userData.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new BadRequestError({
        message: "Invalid password",
        context: { authentication: "Invalid password" },
        logging: true,
      });
    }
    const token = await SecurityUtils.generateToken(user._id);
    const userObject = {
      ...user.toObject(),
      token,
    };

    delete userObject.password;
    return userObject;
  }
}
