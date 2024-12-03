import { Router } from "express";
import {
  UserRegisterDTO,
  UserLoginDTO,
  ConfirmEmailDTO,
  RequestPasswordResetDTO,
  ConfirmPasswordResetDTO,
} from "../domain/user/user.dto";
import { AuthController } from "./auth.controller";
import {
  validateDtoMiddleware,
  authenticateMiddleware,
} from "../../../librairies/middlewares";

const authController = new AuthController();
const router = Router();

router.post(
  "/register/:strategy",
  validateDtoMiddleware(UserRegisterDTO),
  authController.register.bind(authController)
);

router.post(
  "/login/:strategy",
  authenticateMiddleware,
  validateDtoMiddleware(UserLoginDTO),
  authController.login.bind(authController)
);

router.post(
  "/email/confirm",
  validateDtoMiddleware(ConfirmEmailDTO),
  authController.requestEmailConfirmation.bind(authController)
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
