import { Request, Response, Router } from "express";
import { UserCreateDTO } from "../domain/user.dto";
import { UserController } from "./user.controller";
import { validateDtoMiddleware } from "../../../librairies/middlewares/validation.middleware";

const router = Router();
const userController = new UserController();

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
  "/register",
  validateDtoMiddleware(UserCreateDTO),
  userController.register.bind(userController)
);

export default router;
