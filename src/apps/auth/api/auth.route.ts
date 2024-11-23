import { Router } from "express";
import { UserCreateDTO } from "../domain/user.dto";
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
   *       200:
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
    validateDtoMiddleware(UserCreateDTO),
    authController.register.bind(authController)
  );

  return router;
};
