import { Router } from "express";
import { UserController } from "./user.controller";
import {
  validateIdMiddleware,
  authenticateMiddleware,
  validateDtoMiddleware,
} from "../../../../librairies/middlewares";
import { UserUpdateDTO, PasswordUpdateDTO } from "../../domain";

const userController = new UserController();
const router = Router();

router.get("/", userController.getAllUsers.bind(userController));

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
  validateIdMiddleware("User"),
  userController.deleteUserById.bind(userController)
);

router.put(
  "/password/update",
  authenticateMiddleware,
  validateDtoMiddleware(PasswordUpdateDTO),
  userController.updatePassword.bind(userController)
);
export default router;
