import { Router } from "express";
import { OrderController } from "./order.controller";
import {
  validateDtoMiddleware,
  validateIdMiddleware,
  authenticateMiddleware,
  checkRoleMiddleware,
} from "../../../../librairies/middlewares/";
import { OrderCreateFromCartDTO } from "../domain/order.dto";

const router = Router();
const orderController = new OrderController();

router.post(
  "/",
  authenticateMiddleware,
  validateDtoMiddleware(OrderCreateFromCartDTO),
  orderController.createOrderFromCart.bind(orderController)
);

router.get(
  "/",
  authenticateMiddleware,
  orderController.getAllOrders.bind(orderController)
);

router.get(
  "/:id",
  authenticateMiddleware,
  validateIdMiddleware("Order"),
  orderController.getOrderById.bind(orderController)
);

router.put(
  "/:id",
  authenticateMiddleware,
  validateIdMiddleware("Order"),
  orderController.updateOrder.bind(orderController)
);

router.delete(
  "/:id",
  authenticateMiddleware,
  checkRoleMiddleware(["admin"]),
  validateIdMiddleware("Order"),
  orderController.deleteOrder.bind(orderController)
);

export default router;
