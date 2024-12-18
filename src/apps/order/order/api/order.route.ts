import { Router } from "express";
import { OrderController } from "./order.controller";
import { validateDtoMiddleware, validateIdMiddleware } from "../../../../librairies/middlewares/";
import { OrderCreateDTO } from "../domain/order.dto";

const router = Router();
const orderController = new OrderController();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: API for managing orders
 */

/**
 * Configure the Order routes.
 * @param {Router} router - The Express router instance.
 * @returns {Router} - The configured router with Order routes.
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderNumber:
 *                 type: string
 *                 description: Order number
 *                 example: ORD123456
 *               orderDate:
 *                 type: string
 *                 format: date-time
 *                 description: Date the order was placed
 *                 example: 2023-01-01T10:00:00Z
 *               shipDate:
 *                 type: string
 *                 format: date-time
 *                 description: Date the order will be shipped
 *                 example: 2023-01-05T10:00:00Z
 *               status:
 *                 type: string
 *                 enum: [Pending, Shipped, Delivered, Cancelled]
 *                 description: Status of the order
 *                 example: Pending
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Validation error
 */
router.post(
  "/",
  validateDtoMiddleware(OrderCreateDTO),
  orderController.createOrder.bind(orderController)
);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get a list of all orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: List of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */
router.get("/", orderController.getAllOrders.bind(orderController));

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The order ID
 *     responses:
 *       200:
 *         description: Order data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 */
router.get("/:id",
  validateIdMiddleware("Order"),
  orderController.getOrderById.bind(orderController)
);

/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     summary: Update an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderNumber:
 *                 type: string
 *                 description: Order number
 *                 example: ORD123456
 *               orderDate:
 *                 type: string
 *                 format: date-time
 *                 description: Date the order was placed
 *                 example: 2023-01-01T10:00:00Z
 *               shipDate:
 *                 type: string
 *                 format: date-time
 *                 description: Date the order will be shipped
 *                 example: 2023-01-05T10:00:00Z
 *               status:
 *                 type: string
 *                 enum: [Pending, Shipped, Delivered, Cancelled]
 *                 description: Status of the order
 *                 example: Pending
 *     responses:
 *       200:
 *         description: Order updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 */
router.put(
  "/:id",
  validateIdMiddleware("Order"),
  validateDtoMiddleware(OrderCreateDTO),
  orderController.updateOrder.bind(orderController)
);

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Delete an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The order ID
 *     responses:
 *       204:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 */
router.delete(
  "/:id",
  validateIdMiddleware("Order"),
  orderController.deleteOrder.bind(orderController)
);

export default router;