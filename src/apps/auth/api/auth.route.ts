import { Router } from "express";
import {
  UserRegisterDTO,
  UserLoginDTO,
  ForgotPasswordDTO,
} from "../domain/user.dto";
import { AuthController } from "./auth.controller";
import { validateDtoMiddleware } from "../../../librairies/middlewares/validation.middleware";

const authController = new AuthController();
const router = Router();

router.post(
  "/register/:strategy",
  validateDtoMiddleware(UserRegisterDTO),
  authController.register.bind(authController)
);

router.post(
  "/login/:strategy",
  validateDtoMiddleware(UserLoginDTO),
  authController.login.bind(authController)
);

router.post(
  "/password/reset-request",
  validateDtoMiddleware(ForgotPasswordDTO),
  authController.forgotPassword.bind(authController)
);

export default router;
