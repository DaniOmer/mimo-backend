import { IUser } from "../data-access/user.interface";
import { AuthStrategyFactory, Strategy } from "./auth.factory";
import { AuthStrategy } from "./auth.strategy";
import UserRepository from "../data-access/user.repository";
import { IToken, TokenType } from "../data-access/token.interface";
import TokenService from "./token.service";
import BadRequestError from "../../../config/error/bad.request.config";
import { AppConfig } from "../../../config/app.config";
import { SecurityUtils } from "../../../utils/security.utils";
import { BaseService } from "../../../librairies/services";

export type UserCreate = Omit<IUser, "_id" | "createdAt" | "updatedAt">;
export type UserLogin = Pick<IUser, "email" | "password" | "updatedAt">;
export type UserCreateResponse = Omit<IUser, "id" | "password" | "updatedAt">;
export type ResetPasswordData = {
  password: string;
  token: string;
};

export type UserLoginResponse = UserCreateResponse & {
  token: string;
};

export class AuthService extends BaseService {
  private authStrategy: AuthStrategy;
  private userRepository: UserRepository;
  private tokenService: TokenService;

  constructor(strategy: Strategy) {
    super("Auth");
    this.authStrategy = AuthStrategyFactory.create(strategy);
    this.userRepository = new UserRepository();
    this.tokenService = new TokenService();
  }

  async register(userData: UserCreate) {
    const createdUser = await this.authStrategy.register(userData);
    if (this.authStrategy.requestEmailValidation) {
      const emailConfirmationLink =
        await this.authStrategy.requestEmailValidation(createdUser);

      await this.emailNotifier.send({
        recipient: createdUser.email,
        subject: "Welcome to Mimo!",
        templateName: "confirmation-email.html",
        params: {
          confirmation_link: emailConfirmationLink,
        },
      });
    }
    return createdUser;
  }

  async login(userData: UserLogin): Promise<UserLoginResponse> {
    return this.authStrategy.authenticate(userData);
  }

  async requestPassswordReset(email: string): Promise<IToken> {
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
        context: { authentication: "Reset password not available" },
        logging: true,
      });
    }

    const forgotPasswordToken = await this.tokenService.createToken(
      user,
      TokenType.PasswordReset
    );
    const resetPasswordLink = `${AppConfig.client.url}/auth/reset-password?token=${forgotPasswordToken.hash}`;

    // Implement sending reset password email logic here
    // Example: const emailSent = await sendEmail(user.email, "Reset Password", resetPasswordLink);

    // return emailSent
    return forgotPasswordToken;
  }

  async confirmPasswordReset(data: ResetPasswordData): Promise<IUser> {
    const userToken = await this.tokenService.validateToken(
      data.token,
      TokenType.PasswordReset
    );

    const existingUser = await this.userRepository.getById(
      userToken.toString()
    );

    if (!existingUser) {
      throw new BadRequestError({
        logging: true,
        context: { reset_password_confirm: "User not found" },
      });
    }

    const newPassword = await SecurityUtils.hashPassword(data.password);
    existingUser.password = newPassword;
    const updatedUser = await existingUser.save();

    if (!updatedUser) {
      throw new BadRequestError({
        logging: true,
        context: { reset_password_confirm: "Failed to update password" },
      });
    }
    return updatedUser;
  }
}
