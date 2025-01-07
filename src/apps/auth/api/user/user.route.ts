import { Router } from "express";
import { UserController } from "./user.controller";
import {
  validateIdMiddleware,
  authenticateMiddleware,
  validateDtoMiddleware,
  checkRoleMiddleware,
} from "../../../../librairies/middlewares";

import { UserCreateDTO,UserUpdateDTO, PasswordUpdateDTO } from "../../domain";
const userController = new UserController();
const router = Router();


router.get("/", 
  authenticateMiddleware,
  checkRoleMiddleware(["admin"]),
  userController.getAllUsers.bind(userController));


router.get(
  "/:id",
  authenticateMiddleware,
  validateIdMiddleware("User"),
  userController.getUserById.bind(userController)
);


router.put(
  "/:id",
  authenticateMiddleware,
  validateIdMiddleware("User"),
  validateDtoMiddleware(UserUpdateDTO),
  userController.updateUser.bind(userController)
);


router.delete(
  "/:id",
  authenticateMiddleware,
  checkRoleMiddleware(["admin"]),
  validateIdMiddleware("User"),
  userController.deleteUserById.bind(userController)
);



router.post(
  "/createUserFromInvitation",
  validateDtoMiddleware(UserCreateDTO),
  authenticateMiddleware,
  checkRoleMiddleware(["admin"]),
  userController.createUserFromInvitation.bind(userController)
);

router.put(
  "/password/update",
  authenticateMiddleware,
  validateDtoMiddleware(PasswordUpdateDTO),
  userController.updatePassword.bind(userController)
);

router.delete(
  "/multiple/delete",
  authenticateMiddleware,
  checkRoleMiddleware(["admin"]),
  userController.deleteMultipleUsers.bind(userController)
);

router.patch(
  "/multiple/status",
  authenticateMiddleware,
  checkRoleMiddleware(["admin"]),
  userController.disableMultipleUsers.bind(userController)
);

router.patch(
  "/:id/status",
  authenticateMiddleware,
  validateIdMiddleware("User"),
  userController.toggleUserStatus.bind(userController)
);



export default router;
