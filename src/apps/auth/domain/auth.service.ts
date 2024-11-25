import { IUser } from "../data-access/user.interface";
import { AuthStrategyFactory, Strategy } from "./auth.factory";
import { AuthStrategy } from "./auth.strategy";
import { UserRepository } from "../data-access/user.repository";
import BadRequestError from "../../../config/error/bad.request.config";

export type UserCreate = Omit<IUser, "_id" | "createdAt" | "updatedAt">;
export type UserLogin = Pick<IUser, "email" | "password" | "updatedAt">;
export type UserCreateResponse = Omit<IUser, "id" | "password" | "updatedAt">;

export type UserLoginResponse = UserCreateResponse & {
  token: string;
};

export class AuthService {
  private authStrategy: AuthStrategy;
  private userRepository: UserRepository;

  constructor(strategy: Strategy) {
    this.authStrategy = AuthStrategyFactory.create(strategy);
    this.userRepository = new UserRepository();
  }

  async register(userData: UserCreate) {
    return this.authStrategy.register(userData);
  }

  async login(userData: UserLogin): Promise<UserLoginResponse> {
    return this.authStrategy.authenticate(userData);
  }

  async sendResetPasswordEmail(email: string): Promise<boolean> {
    const user = await this.userRepository.getByEmail(email);
    if (!user) {
      throw new BadRequestError({
        message: "Email not found",
        context: { authentication: "Email not found" },
        logging: true,
      });
    }

    if (user.authType !== "basic") {
      throw new BadRequestError({
        message: "Bad Request",
        context: { authentication: "Reset password feature" },
        logging: true,
      });
    }

    // Implement sending reset password email logic here
    // Example: const emailSent = await sendEmail(user.email, "Reset Password", resetPasswordLink);

    // return emailSent
    return true;
  }
}
