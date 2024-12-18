import { Router } from "express";
import { CartController } from "./cart.controller";
import { validateDtoMiddleware } from "../../../../librairies/middlewares";
import { CartCreateDTO } from "../domain/cart.dto";

const router = Router();
const cartController = new CartController();

/**
 * @swagger
 * tags:
 *   name: Carts
 *   description: API for managing carts
 */

/**
 * @swagger
 * /api/carts:
 *   get:
 *     summary: Get the cart of the authenticated user
 *     tags: [Carts]
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 */
router.get("/", cartController.getCart.bind(cartController));

/**
 * @swagger
 * /api/carts:
 *   put:
 *     summary: Update the cart of the authenticated user
 *     tags: [Carts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cart'
 *     responses:
 *       200:
 *         description: Cart updated successfully
 */
router.put("/", validateDtoMiddleware(CartCreateDTO), cartController.updateCart.bind(cartController));

/**
 * @swagger
 * /api/carts:
 *   delete:
 *     summary: Delete the cart of the authenticated user
 *     tags: [Carts]
 *     responses:
 *       204:
 *         description: Cart deleted successfully
 */
router.delete("/", cartController.deleteCart.bind(cartController));

export default router;