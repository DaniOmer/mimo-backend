import { Router } from "express";
import { UserController } from "./user.controller";

const userController = new UserController();

export default (router: Router) => {
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
    "/",
    userController.getAllUsers.bind(userController)
  );

  /**
   * @swagger
   * /api/users/{id}:
   *   get:
   *     summary: Get user by id
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: User id
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Get user by id
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       404:
   *         description: User not found
   */
  router.get("/:id", userController.getUserById.bind(userController));

  return router;
};
