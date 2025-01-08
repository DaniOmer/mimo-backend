import { Types } from "mongoose";
import { InvitationRepository } from "../../data-access/invitation/invitation.repository";
import TokenService from "../../domain/token/token.service";
import BadRequestError from "../../../../config/error/bad.request.config";
import { AppConfig } from "../../../../config/app.config";
import { TokenType } from "../../data-access/token/token.interface";
import { BaseService } from "../../../../librairies/services";
import { IRole } from "../../data-access";
import { UserService } from "../user/user.service";

export class InvitationService extends BaseService {
  private invitationRepository: InvitationRepository;
  private userService: UserService;
  private tokenService: TokenService;

  constructor() {
    super("Invitation");
    this.invitationRepository = new InvitationRepository();
    this.userService = new UserService();
    this.tokenService = new TokenService();
  }

  async createInvitation(
    firstName: string,
    lastName: string,
    email: string,
    currentUserId: string,
    roleId: string
  ): Promise<void> {
    const existingUser = await this.userService.getUserByEmail(email);
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
 
    const currentUser = await this.userService.getById(currentUserId);
    if (!currentUser) {
      throw new BadRequestError({ message: "User not found", code: 400 });
    }
  
    const token = await this.tokenService.createToken(currentUser, TokenType.Invitation);
 
     await this.invitationRepository.create({
      firstName,
      lastName,
      email,
      admin: new Types.ObjectId(currentUserId),
      token: new Types.ObjectId(token._id),
      role: new Types.ObjectId(roleId),
    });

    const registrationLink = `${AppConfig.client.url}/users/register?tokenHash=${token.hash}`;
    await this.sendInvitationEmail(email, firstName, registrationLink);

  }

  private async sendInvitationEmail(email: string, firstName: string, registrationLink: string): Promise<void> {
    await this.emailNotifier.send({
      recipient: email,
      subject: "You're Invited to Join!",
      templateName: "invitation-email.html",
      params: { firstName, registration_link: registrationLink },
    });
  }

  
  async validateInvitation(
    tokenHash: string
  ): Promise<{
    firstName: string;
    lastName: string;
    email: string;
    role: IRole;
    invitationId: string;
  }> {
   
    const token = await this.tokenService.validateAndReturnToken(
      tokenHash,
      TokenType.Invitation
    );

    const validInvitation = await this.invitationRepository.findByToken(token._id);
    if (!validInvitation) {
      throw new BadRequestError({
        message: "Invitation not found",
        code: 400,
      });
    }

    return {
      firstName: validInvitation.firstName,
      lastName: validInvitation.lastName,
      email: validInvitation.email,
      role: validInvitation.role as IRole,
      invitationId: validInvitation._id.toString(),
    };
}

async deleteInvitation(invitationId: string): Promise<void> {
  await this.invitationRepository.deleteById(invitationId);
}
}
