import { Router } from "express";
import { OrderItemController } from "./orderItems.controller";
import { validateDtoMiddleware, validateIdMiddleware } from "../../../librairies/middlewares/";
import { OrderItemCreateDTO } from "../domain/orderItems.dto";

const router = Router();
const orderItemController = new OrderItemController();

/**
 * @swagger
 * tags:
 *   name: OrderItems
 *   description: API for managing OrderItems
 */

/**
 * @swagger
 * /api/order-items:
 *   post:
 *     summary: Create a new OrderItem
 *     tags: [OrderItems]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderItem'
 *     responses:
 *       201:
 *         description: OrderItem created successfully
 */
router.post(
  "/",
  validateDtoMiddleware(OrderItemCreateDTO),
  orderItemController.createOrderItem.bind(orderItemController)
);

/**
 * @swagger
 * /api/order-items/order/{orderId}:
 *   get:
 *     summary: Get OrderItems by Order ID
 *     tags: [OrderItems]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the Order
 *     responses:
 *       200:
 *         description: OrderItems retrieved successfully
 */
router.get(
  "/order/:orderId",
  validateIdMiddleware("Order"),
  orderItemController.getOrderItemsByOrderId.bind(orderItemController)
);

/**
 * @swagger
 * /api/order-items/{id}:
 *   delete:
 *     summary: Delete an OrderItem by ID
 *     tags: [OrderItems]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the OrderItem
 *     responses:
 *       204:
 *         description: OrderItem deleted successfully
 */
router.delete(
  "/:id",
  validateIdMiddleware("OrderItem"),
  orderItemController.deleteOrderItem.bind(orderItemController)
);

export default router;