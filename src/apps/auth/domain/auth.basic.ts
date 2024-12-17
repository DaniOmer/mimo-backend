import { AuthStrategy } from "./auth.strategy";
import UserRepository from "../data-access/user.repository";
import { SecurityUtils } from "../../../utils/security.utils";
import BadRequestError from "../../../config/error/bad.request.config";
import { IUser } from "../data-access/user.interface";
import TokenService from "./token.service";
import {
  UserCreate,
  UserCreateResponse,
  UserLogin,
  UserLoginResponse,
} from "./auth.service";
import { TokenType } from "../data-access/token.interface";
import { AppConfig } from "../../../config/app.config";

export class BasicAuthStrategy implements AuthStrategy {
  readonly userRepository: UserRepository;
  readonly tokenService: TokenService;

  constructor() {
    this.userRepository = new UserRepository();
    this.tokenService = new TokenService();
  }

  async register(userData: UserCreate): Promise<UserCreateResponse> {
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

  async authenticate(userData: UserLogin): Promise<UserLoginResponse> {
    const user = await this.userRepository.getByEmail(userData.email);
    if (!user || user.isDisabled) {
      throw new BadRequestError({
        code: 404,
        message: "Invalid credentials",
        context: { authentication: "Invalid credentials" },
        logging: true,
      });
    }

    if (!user.isVerified) {
      throw new BadRequestError({
        message: "Email not verified",
        logging: true,
      });
    }

    const isPasswordValid = await SecurityUtils.comparePassword(
      userData.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new BadRequestError({
        message: "Invalid credentials",
        context: { authentication: "Invalid credentials" },
        logging: true,
      });
    }
    const token = await SecurityUtils.generateJWTToken(user._id);
    const { _id, password, updatedAt, ...userToDisplay } = user.toObject();
    const userObject = {
      ...userToDisplay,
      token,
    };

    return userObject;
  }

  async requestEmailValidation(user: IUser): Promise<string> {
    const token = await this.tokenService.createToken(
      user,
      TokenType.Confirmation
    );

    const emailValidationLink = `${AppConfig.client.url}/auth/email-validation?token=${token.hash}`;
    return emailValidationLink;
  }
}
