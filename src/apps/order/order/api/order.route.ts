import { Router } from "express";
import { OrderController } from "./order.controller";
import {
  validateDtoMiddleware,
  validateIdMiddleware,
  authenticateMiddleware,
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
  "/me",
  authenticateMiddleware,
  orderController.getAllOrdersByUser.bind(orderController)
);

router.get(
  "/status/:status",
  authenticateMiddleware,
  orderController.getAllOrdersByStatus.bind(orderController)
);

router.get(
  "/number/:number",
  authenticateMiddleware,
  orderController.getOrderByNumber.bind(orderController)
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

export default router;
