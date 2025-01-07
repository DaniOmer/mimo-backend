import { AppConfig } from "../../../../config/app.config";
import { SecurityUtils } from "../../../../utils/security.utils";
import { AuthStrategy } from "./auth.strategy";
import { AuthStrategyFactory, Strategy } from "./auth.factory";
import { IUser, TokenType, UserRepository } from "../../data-access";
import TokenService from "../token/token.service";
import BadRequestError from "../../../../config/error/bad.request.config";
import { BaseService } from "../../../../librairies/services";
import {
  UserRegisterDTO,
  UserLoginDTO,
  ConfirmPasswordResetDTO,
} from "../user/user.dto";

import { PreferenceService } from "../../../preference/domain/preference.service";

export type UserCreateResponse = Omit<IUser, "id" | "password" | "updatedAt">;
export type UserLoginResponse = UserCreateResponse & {
  token: string;
};

export class AuthService extends BaseService {
  readonly authStrategy: AuthStrategy;
  readonly userRepository: UserRepository;
  readonly tokenService: TokenService;
  readonly preferenceService: PreferenceService;

  constructor(strategy: Strategy) {
    super("Auth");
    this.authStrategy = AuthStrategyFactory.create(strategy);
    this.userRepository = new UserRepository();
    this.tokenService = new TokenService();
    this.preferenceService = new PreferenceService();
  }

  async register(userData: UserRegisterDTO) {
    const createUserResponse = await this.authStrategy.register(userData);
    if (this.authStrategy.getEmailValidationLink) {
      const emailConfirmationLink =
        await this.authStrategy.getEmailValidationLink(createUserResponse);
      await this.sendWelcomeEmail(userData.email, emailConfirmationLink);
    }
    await this.preferenceService.createDefaultPreference(createUserResponse);
    return createUserResponse;
  }

  async login(userData: UserLoginDTO): Promise<UserLoginResponse> {
    const loginUserResponse = await this.authStrategy.authenticate(userData);
    return loginUserResponse;
  }

  async confirmEmailRequest(hash: string): Promise<IUser> {
    const token = await this.tokenService.validateAndReturnToken(
      hash,
      TokenType.Confirmation
    );

    const user =
      typeof token.user === "string"
        ? await this.userRepository.getById(token.user)
        : token.user;

    if (!user) {
      throw new BadRequestError({
        message: "Invalid email confirmation token",
        context: { auth_email_confirmation: "Invalid token" },
        logging: true,
      });
    }

    const updatedUser = await this.userRepository.updateById(user._id, {
      isVerified: true,
    });

    if (!updatedUser) {
      throw new BadRequestError({
        message: "Failed to confirm user email",
        context: { auth_email_confirmation: "Failed to confirm email" },
        logging: true,
        code: 500,
      });
    }
    return updatedUser;
  }

  async requestPassswordReset(email: string): Promise<string> {
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
    await this.sendPasswordResetEmail(email, resetPasswordLink);
    return resetPasswordLink;
  }

  async confirmPasswordReset(data: ConfirmPasswordResetDTO): Promise<IUser> {
    const tokenUser = await this.tokenService.validateAndReturnToken(
      data.token,
      TokenType.PasswordReset
    );

    const user =
      typeof tokenUser.user === "string"
        ? await this.userRepository.getById(tokenUser.user)
        : tokenUser.user;

    if (!user) {
      throw new BadRequestError({
        logging: true,
        context: { reset_password_confirm: "User not found" },
      });
    }

    const newPassword = await SecurityUtils.hashPassword(data.password);
    const updatedUser = await this.userRepository.updateById(user._id, {
      password: newPassword,
    });

    if (!updatedUser) {
      throw new BadRequestError({
        logging: true,
        context: { reset_password_confirm: "Failed to update password" },
      });
    }
    return updatedUser;
  }

  async sendWelcomeEmail(email: string, confirmationLink: string) {
    await this.emailNotifier.send({
      recipient: email,
      subject: "Welcome to Mimo!",
      templateName: "confirmation-email.html",
      params: {
        confirmation_link: confirmationLink,
      },
    });
  }

  async sendPasswordResetEmail(email: string, resetLink: string) {
    await this.emailNotifier.send({
      recipient: email,
      subject: "Réinitialisation de votre mot de passe",
      templateName: "password-reset-email.html",
      params: {
        reset_link: resetLink,
      },
    });
  }
  
}
