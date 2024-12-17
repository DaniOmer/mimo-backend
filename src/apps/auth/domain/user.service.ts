import { Types } from "mongoose";
import UserRepository from "../data-access/user.repository";
import { IUser, Role, AuthType } from "../data-access/user.interface";
import { InvitationModel } from "../data-access/invitation.model";
import { BaseService } from "../../../librairies/services";
import BadRequestError from "../../../config/error/bad.request.config";
import TokenService from "./token.service";
import { AppConfig } from "../../../config/app.config";
import { TokenType } from "../data-access/token.interface";
import { SecurityUtils } from "../../../utils/security.utils";


export type UserResponse = Omit<IUser, "password">;

export class UserService extends BaseService {
  private repository: UserRepository;
  private tokenService: TokenService;

  constructor() {
    super("User");
    this.repository = new UserRepository();
    this.tokenService = new TokenService();
  }

  async getAllUsers(): Promise<UserResponse[]> {
    const users = await this.repository.getAll();
    return users.map((user) => {
      const { password, ...userWithoutPassword } = user.toObject();
      return userWithoutPassword;
    });
  }

  async getUserById(id: string): Promise<UserResponse> {
    const user = await this.repository.getById(id);
    if (!user) {
      throw new BadRequestError({ message: "User not found", code: 404 });
    }
    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  }

  async updateUserById(id: string, updateData: Partial<IUser>): Promise<UserResponse> {
    const updatedUser = await this.repository.updateById(id, updateData);
    if (!updatedUser) {
      throw new BadRequestError({ message: "User not found", code: 404 });
    }
    const { password, ...userWithoutPassword } = updatedUser.toObject();
    return userWithoutPassword;
  }

  async deleteUserById(id: string): Promise<UserResponse> {
    const deletedUser = await this.repository.deleteById(id);
    if (!deletedUser) {
      throw new BadRequestError({ message: "User not found", code: 404 });
    }
    const { password, ...userWithoutPassword } = deletedUser.toObject();
    return userWithoutPassword;
  }

  async createInvitation(
    firstName: string,
    lastName: string,
    email: string,
    adminId: string,
    role: Role
  ): Promise<void> {
    
    const existingUser = await this.repository.getByEmail(email);
    if (existingUser) {
      throw new BadRequestError({ message: "Email already in use", code: 400 });
    }

   
    const admin = await this.repository.getById(adminId);
    if (!admin) {
      throw new BadRequestError({ message: "Admin user not found", code: 404 });
    }

    const token = await this.tokenService.createToken(admin, TokenType.Confirmation);
    if (!token || !token._id) {
      throw new BadRequestError({ message: "Failed to create token for invitation", code: 400 });
    }

    const newInvitation = new InvitationModel({
      firstName,
      lastName,
      email,
      admin: adminId,
      token: token._id,
      role,
    });
    await newInvitation.save();

    // Send an email with the invitation link
    const registrationLink = `${AppConfig.client.url}/users/register?tokenHash=${token.hash}`;
    await this.sendInvitationEmail(email, firstName, registrationLink);
  }

  /**
   * Send an invitation email to the user
   */
  private async sendInvitationEmail(email: string, firstName: string, registrationLink: string): Promise<void> {
    await this.emailNotifier.send({
      recipient: email,
      subject: "You're Invited to Join!",
      templateName: "invitation-email.html",
      params: { firstName, registration_link: registrationLink },
    });
  }

  /**
   * Create a new user based on a valid invitation token
   */
  async createUser(
    tokenHash: string,
    userData: Pick<IUser, "password" | "isTermsOfSale">
  ): Promise<UserResponse> {
    const token = await this.tokenService.validateAndReturnToken(tokenHash, TokenType.Confirmation);

    const validInvitation = await InvitationModel.findOne({ token: token._id }).exec();
    if (!validInvitation) {
      throw new BadRequestError({ message: "Invitation not found", code: 400 });
    }

    const hashedPassword = await SecurityUtils.hashPassword(userData.password);

    const newUser = await this.repository.create({
      firstName: validInvitation.firstName,
      lastName: validInvitation.lastName,
      email: validInvitation.email,
      password: hashedPassword,
      role: validInvitation.role,
      isTermsOfSale: userData.isTermsOfSale,
      isVerified: true,
      isDisabled: false,
      authType: AuthType.Basic,
    });

    await InvitationModel.findByIdAndDelete(validInvitation._id);

    const { password, ...userWithoutPassword } = newUser.toObject();
    return userWithoutPassword;
  }
}
