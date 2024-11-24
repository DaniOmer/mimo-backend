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

  return router;
};
