import { Router } from "express";
import { UserController } from "./user.controller";
import {
  validateDtoMiddleware,
  validateIdMiddleware,
} from "../../../librairies/middlewares/";

const userController = new UserController();
const router = Router();

router.get("/", userController.getAllUsers.bind(userController));

router.get(
  "/:id",
  validateIdMiddleware("User"),
  userController.getUserById.bind(userController)
);

router.put(
  "/:id",
  validateIdMiddleware("User"),
  userController.updateUser.bind(userController)
);

router.delete(
  "/:id",
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