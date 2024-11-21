import { Router } from "express";
import { UserCreateDTO } from "../domain/user.dto";
import { AuthController } from "./auth.controller";
import { validateDtoMiddleware } from "../../../librairies/middlewares/validation.middleware";

const router = Router();
const authController = new AuthController();

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

export default router;
