import { Request, Response, NextFunction } from "express";
import { InvitationService } from "../../domain/invitation/invitation.service";
import { ApiResponse } from "../../../../librairies/controllers/api.response";

export class InvitationController {
  private invitationService: InvitationService;
  constructor() {
    this.invitationService = new InvitationService();
  }
  
  async createInvitation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { firstName, lastName, email, roleId } = req.body;
      const currentUserId = req.user._id;
      await this.invitationService.createInvitation(firstName, lastName, email, currentUserId, roleId);
      ApiResponse.success(res, "Invitation created successfully and email sent", null, 201);
    } catch (error) {
      next(error);
    }
  }
}
  

