import { Router } from "express";
import { UserController } from "./user.controller";
import {
  validateIdMiddleware,
  authenticateMiddleware,
  validateDtoMiddleware,
} from "../../../../librairies/middlewares";
import { UserRegisterDTO } from "../../domain";

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
  validateDtoMiddleware(UserRegisterDTO),
  userController.updateUser.bind(userController)
);

router.delete(
  "/:id",
  authenticateMiddleware,
  validateIdMiddleware("User"),
  userController.deleteUserById.bind(userController)
);


router.post(
  "/invite",
  userController.createInvitation.bind(userController)
);

router.post(
  "/createUser",
  userController.createUser.bind(userController)
);
export default router;
