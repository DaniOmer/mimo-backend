import { AuthStrategy } from "./auth.strategy";
import UserRepository from "../data-access/user.repository";
import { SecurityUtils } from "../../../utils/security.utils";
import BadRequestError from "../../../config/error/bad.request.config";
import { IUser } from "../data-access/user.interface";
import TokenService from "./token.service";
import {
  UserCreateResponse,
  UserLogin,
  UserLoginResponse,
} from "./auth.service";
import { TokenType } from "../data-access/token.interface";
import { AppConfig } from "../../../config/app.config";
import RoleService from "./role.service";
import { UserRegisterDTO } from "./user.dto";
import { IRole } from "../data-access/role.interface";

export class BasicAuthStrategy implements AuthStrategy {
  readonly userRepository: UserRepository;
  readonly tokenService: TokenService;
  readonly roleService: RoleService;

  constructor() {
    this.userRepository = new UserRepository();
    this.tokenService = new TokenService();
    this.roleService = new RoleService();
  }

  async register(userData: UserRegisterDTO): Promise<UserCreateResponse> {
    const existingUser = await this.userRepository.getByEmail(userData.email);
    if (existingUser) {
      throw new BadRequestError({
        message: "Email already exists",
        context: { field_validation: ["email"] },
        logging: true,
      });
    }

    const existingRoles: IRole[] = [];
    const rolesPromises = userData.roles.map(async (roleName) => {
      const role = await this.roleService.getRoleByName(roleName);
      if (!role) {
        throw new BadRequestError({
          message: `Role ${roleName} not found`,
          code: 400,
          context: { field_validation: ["roles"] },
          logging: true,
        });
      }
      return role;
    });

    existingRoles.push(...(await Promise.all(rolesPromises)));

    const hashedPassword = await SecurityUtils.hashPassword(userData.password);
    const newUser = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
      roles: existingRoles,
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
