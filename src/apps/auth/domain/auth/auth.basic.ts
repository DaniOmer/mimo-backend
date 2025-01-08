import { AppConfig } from "../../../../config/app.config";
import { AuthStrategy } from "./auth.strategy";
import { SecurityUtils } from "../../../../utils/security.utils";
import BadRequestError from "../../../../config/error/bad.request.config";
import {
  IUser,
  IRole,
  IPermission,
  UserRepository,
  TokenType,
  AuthType,
  RoleAvailable,
} from "../../data-access";
import TokenService from "../token/token.service";
import { UserCreateResponse, UserLoginResponse } from "./auth.service";

import RoleService from "../role/role.service";
import { UserRegisterDTO, UserLoginDTO } from "../user/user.dto";

export type UserRole = {
  _id: string;
  name: string;
};
export type UserPermission = {
  _id: string;
  name: string;
};
export class BasicAuthStrategy implements AuthStrategy {
  readonly userRepository: UserRepository;
  readonly tokenService: TokenService;
  readonly roleService: RoleService;

  constructor() {
    this.userRepository = new UserRepository();
    this.tokenService = new TokenService();
    this.roleService = new RoleService();
  }

  async register(userData: UserRegisterDTO): Promise<IUser> {
    const existingUser = await this.userRepository.getByEmail(userData.email);
    if (existingUser) {
      throw new BadRequestError({
        message: "Email already exists",
        context: { field_validation: ["email"] },
        logging: true,
      });
    }

    const userRole = await this.roleService.getRoleByName(RoleAvailable.USER);
    if (!userRole) {
      throw new BadRequestError({
        message: `Role not found`,
        code: 400,
        context: { app_initialization_failed: "Init role are not available" },
        logging: true,
      });
    }

    const hashedPassword = await SecurityUtils.hashPassword(userData.password);
    const newUser = await this.userRepository.create({
      ...userData,
      authType: AuthType.Basic,
      password: hashedPassword,
      roles: [userRole],
    });

    const userObject = newUser.toObject();
    delete userObject.password;
    return userObject;
  }

  async authenticate(userData: UserLoginDTO): Promise<UserLoginResponse> {
    const user = await this.checkUserExistsAndValidate(userData);
    const { password, ...userToDisplay } = user.toObject();
    const rolesWDate = this.getRolesWithoutDate(userToDisplay.roles);
    const permissionsWDate = this.getPermissionsWithoutDate(
      userToDisplay.permissions
    );

    const token = await SecurityUtils.generateJWTToken({
      _id: user._id,
      roles: rolesWDate,
      permissions: permissionsWDate,
    });

    return {
      ...userToDisplay,
      roles: rolesWDate,
      permissions: permissionsWDate,
      token,
    };
  }

  async getEmailValidationLink(user: IUser): Promise<string> {
    const token = await this.tokenService.createToken(
      user,
      TokenType.Confirmation
    );

    const emailValidationLink = `${AppConfig.client.url}/auth/email-validation?token=${token.hash}`;
    return emailValidationLink;
  }

  async checkUserExistsAndValidate(userData: UserLoginDTO): Promise<IUser> {
    const user = await this.userRepository.getByEmail(userData.email);
    if (!user || user.isDisabled) {
      throw new BadRequestError({
        code: 401,
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
        code: 401,
        message: "Invalid credentials",
        context: { authentication: "Invalid credentials" },
        logging: true,
      });
    }

    return user;
  }

  getRolesWithoutDate(roles: IRole[]): UserRole[] {
    return roles.map((role: IRole) => {
      return {
        _id: role._id.toString(),
        name: role.name,
      };
    });
  }

  getPermissionsWithoutDate(permissions: IPermission[]): UserPermission[] {
    return permissions.map((permission: IPermission) => {
      return {
        _id: permission._id.toString(),
        name: permission.name,
      };
    });
  }
}
