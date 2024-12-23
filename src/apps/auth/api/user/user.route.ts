import { Router } from "express";
import { UserController } from "./user.controller";
import {
  validateIdMiddleware,
  authenticateMiddleware,
  validateDtoMiddleware,
} from "../../../../librairies/middlewares";
import { UserCreateDTO, UserRegisterDTO } from "../../domain";

const userController = new UserController();
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for managing users
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users.
 */
router.get("/", userController.getAllUsers.bind(userController));

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User details.
 *       404:
 *         description: User not found.
 */
router.get(
  "/:id",
  authenticateMiddleware,
  validateIdMiddleware("User"),
  userController.getUserById.bind(userController)
);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegisterDTO'
 *     responses:
 *       200:
 *         description: User updated successfully.
 *       404:
 *         description: User not found.
 */
router.put(
  "/:id",
  authenticateMiddleware,
  validateIdMiddleware("User"),
  validateDtoMiddleware(UserRegisterDTO),
  userController.updateUser.bind(userController)
);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       404:
 *         description: User not found.
 */
router.delete(
  "/:id",
  authenticateMiddleware,
  validateIdMiddleware("User"),
  userController.deleteUserById.bind(userController)
);

/**
 * @swagger
 * /users/createFromInvitation:
 *   post:
 *     summary: Create a user from an invitation
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCreateDTO'
 *     responses:
 *       201:
 *         description: User created successfully.
 *       400:
 *         description: Validation failed.
 */
router.post(
  "/createUserFromInvitation",
  validateDtoMiddleware(UserCreateDTO),
  userController.createUserFromInvitation.bind(userController)
);

export default router;
