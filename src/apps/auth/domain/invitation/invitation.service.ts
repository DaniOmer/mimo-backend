import { Types } from "mongoose";
import { InvitationRepository } from "../../data-access/invitation/invitation.repository";
import { IInvitation } from "../../data-access/invitation/invitation.interface";
import { UserRepository } from "../../data-access/user/user.repository";
import TokenService from "../../domain/token/token.service";
import BadRequestError from "../../../../config/error/bad.request.config";
import { AppConfig } from "../../../../config/app.config";
import { SecurityUtils } from "../../../../utils/security.utils";
import { AuthType, IUser } from "../../data-access/user/user.interface";
import { TokenType } from "../../data-access/token/token.interface";
import { BaseService } from "../../../../librairies/services";

import { IRole } from "../../data-access";

export class InvitationService extends BaseService {
  private invitationRepository: InvitationRepository;
  private userRepository: UserRepository;
  private tokenService: TokenService;

  constructor() {
    super("Invitation");
    this.invitationRepository = new InvitationRepository();
    this.userRepository = new UserRepository();
    this.tokenService = new TokenService();
  }

  /**
   * Créer une nouvelle invitation
   */
  async createInvitation(
    firstName: string,
    lastName: string,
    email: string,
    admin: IUser,
    roleId: string
  ): Promise<void> {
    const existingUser = await this.userRepository.getByEmail(email);
    if (existingUser) {
      throw new BadRequestError({ message: "Email already in use", code: 400 });
    }

    const existingInvitation = await this.invitationRepository.findByEmail(email);
    if (existingInvitation) {
      throw new BadRequestError({
        message: "An invitation with this email already exists",
        code: 400,
      });
    }

    const token = await this.tokenService.createToken(admin, TokenType.Confirmation);

    await this.invitationRepository.create({
      firstName,
      lastName,
      email,
      admin: new Types.ObjectId(admin._id),
      token: new Types.ObjectId(token._id),
      role: new Types.ObjectId(roleId),
    });

    const registrationLink = `${AppConfig.client.url}/users/register?tokenHash=${token.hash}`;
    await this.sendInvitationEmail(email, firstName, registrationLink);
  }

  /**
   * Envoyer un email d'invitation
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
   * Créer un utilisateur à partir d'une invitation
   */
  async createUserFromInvitation(
    tokenHash: string,
    password: string,
    isTermsOfSale: boolean
  ): Promise<Response> {
    const token = await this.tokenService.validateAndReturnToken(tokenHash, TokenType.Confirmation);

    const validInvitation = await this.invitationRepository.findByToken(token._id);
    if (!validInvitation) {
      throw new BadRequestError({
        message: "Invitation not found",
        code: 400,
      });
    }

    const hashedPassword = await SecurityUtils.hashPassword(password);

    const newUser = await this.userRepository.create({
      firstName: validInvitation.firstName,
      lastName: validInvitation.lastName,
      email: validInvitation.email,
      password: hashedPassword,
      roles:[validInvitation.role] as IRole[],
      isTermsOfSale:isTermsOfSale,
      isVerified: true,
      isDisabled: false,
      authType: AuthType.Basic,
    });

    await this.invitationRepository.deleteById(validInvitation._id);

    const { password: _, ...userWithoutPassword } = newUser.toObject();
    return userWithoutPassword;
  }
}
