import { Router } from "express";
import { PermissionController } from "./permission.controller";
import { PermissionCreateDTO } from "../../domain/permission/permission.dto";
import { validateDtoMiddleware } from "../../../../librairies/middlewares";

const router = Router();
const permissionController = new PermissionController();

router.post(
  "/",
  validateDtoMiddleware(PermissionCreateDTO),
  permissionController.createPermission.bind(permissionController)
);

export default router;
