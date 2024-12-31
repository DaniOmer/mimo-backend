import { Router } from "express";
import { InvitationController } from "./invitation.controller";
import {
  authenticateMiddleware,
  validateDtoMiddleware,
  checkRoleMiddleware,
  validateIdMiddleware,
} from "../../../../librairies/middlewares";
import { InvitationCreateDTO, UserCreateDTO } from "../../domain/invitation/invitation.dto"

const invitationController = new InvitationController();
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Invitations
 *   description: API for managing invitations
 */

router.post(
  "/",
  authenticateMiddleware, 
  checkRoleMiddleware(["admin"]), 
  validateDtoMiddleware(InvitationCreateDTO), 
  invitationController.createInvitation.bind(invitationController)
);
export default router;
