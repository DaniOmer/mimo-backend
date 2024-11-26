import { Router } from "express";
import {
  UserRegisterDTO,
  UserLoginDTO,
  RequestPasswordResetDTO,
  ConfirmPasswordResetDTO,
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
  validateDtoMiddleware(RequestPasswordResetDTO),
  authController.requestPassswordReset.bind(authController)
);

router.post(
  "/password/reset-confirm",
  validateDtoMiddleware(ConfirmPasswordResetDTO),
  authController.confirmPasswordReset.bind(authController)
);

export default router;
