import { Router } from "express";
import { UserRegisterDTO, UserLoginDTO } from "../domain/user.dto";
import { AuthController } from "./auth.controller";
import { validateDtoMiddleware } from "../../../librairies/middlewares/validation.middleware";

const authController = new AuthController();

export default (router: Router) => {
  /**
   * @swagger
   * /api/users:
   *   post:
   *     summary: Register a user
   *     tags: [Users]
   *     responses:
   *       201:
   *         description: Register a user
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 $ref: '#/components/schemas/User'
   */
  router.post(
    "/register/:strategy",
    validateDtoMiddleware(UserRegisterDTO),
    authController.register.bind(authController)
  );

  /**
   * @swagger
   * /api/auth/login/{strategy}:
   *   post:
   *     summary: Authenticate a user
   *     tags: [Users]
   *     responses:
   *       200:
   *       description: Login a user
   *       content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 $ref: '#/components/schemas/User'
   */
  router.post(
    "/login/:strategy",
    validateDtoMiddleware(UserLoginDTO),
    authController.login.bind(authController)
  );

  /**
   * @swagger
   * /api/users:
   *   get:
   *     summary: Get all users
   *     tags: [Users]
   *     responses:
   *       200:
   *         description: List all users
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/User'
   */
  router.get(
    "/users",
    authController.getAllUsers.bind(authController)
  );
  
  return router;
};
