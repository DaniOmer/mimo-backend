import { Router } from "express";
import { InvitationController } from "./invitation.controller";
import {
  authenticateMiddleware,
  validateDtoMiddleware,
  checkRoleMiddleware,
} from "../../../../librairies/middlewares";
import { InvitationCreateDTO, UserCreateDTO } from "../../domain/invitation/invitation.dto"

const invitationController = new InvitationController();
const router = Router();

router.post(
  "/",
  authenticateMiddleware, 
  checkRoleMiddleware(["admin"]), 
  validateDtoMiddleware(InvitationCreateDTO), 
  invitationController.createInvitation.bind(invitationController)
);

router.post(
    "/createUserFromInvitation",
    validateDtoMiddleware(UserCreateDTO), 
    invitationController.createUserFromInvitation.bind(invitationController) 
  );
export default router;
