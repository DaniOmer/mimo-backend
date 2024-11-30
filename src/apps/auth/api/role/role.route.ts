import { Router } from "express";
import RoleController from "./role.controller";
import { RoleCreateDTO } from "../../domain/role/role.dto";
import {
  validateDtoMiddleware,
  authenticateMiddleware,
  checkRoleMiddleware,
} from "../../../../librairies/middlewares";

const router = Router();
const roleController = new RoleController();

router.post(
  "/",
  authenticateMiddleware,
  checkRoleMiddleware(["admin"]),
  validateDtoMiddleware(RoleCreateDTO),
  roleController.createRole.bind(roleController)
);

export default router;
