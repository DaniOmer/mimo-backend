import { Request, Response, NextFunction } from "express";
import { InvitationService } from "../../domain/invitation/invitation.service";
import { ApiResponse } from "../../../../librairies/controllers/api.response";
import { IUser } from "../../data-access/user/user.interface";

export class InvitationController {
  private invitationService: InvitationService;

  constructor() {
    this.invitationService = new InvitationService();
  }

  /**
   * Créer une invitation
   */
  async createInvitation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { firstName, lastName, email, roleId } = req.body;
      
     
      const admin = req.user as IUser;

      await this.invitationService.createInvitation(firstName, lastName, email, admin, roleId);
      ApiResponse.success(res, "Invitation created successfully and email sent", null, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Créer l'utilisateur à partir de l'invitation
   */
    async createUserFromInvitation(req: Request,res: Response,next: NextFunction): Promise<void> {
      try {
        const { password, isTermsOfSale, tokenHash } = req.body;

        const newUser = await this.invitationService.createUserFromInvitation(
          tokenHash,
          password,
          isTermsOfSale
        );

        ApiResponse.success(res, "User registered successfully", newUser, 201);
      } catch (error) {
        next(error); 
      }
    }
}
  

