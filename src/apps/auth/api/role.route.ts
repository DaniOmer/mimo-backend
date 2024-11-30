import { Router } from "express";
import RoleController from "./role.controller";
import { RoleCreateDTO } from "../domain/role.dto";
import { validateDtoMiddleware } from "../../../librairies/middlewares";

const router = Router();
const roleController = new RoleController();

router.post(
  "/",
  validateDtoMiddleware(RoleCreateDTO),
  roleController.createRole.bind(roleController)
);

export default router;
