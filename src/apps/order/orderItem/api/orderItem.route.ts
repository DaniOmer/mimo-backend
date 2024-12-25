import { Router } from "express";
import { OrderItemController } from "./orderItem.controller";
import {
  validateDtoMiddleware,
  validateIdMiddleware,
  authenticateMiddleware,
} from "../../../../librairies/middlewares";
import { OrderItemCreateDTO } from "../domain/orderItem.dto";

const router = Router();
const orderItemController = new OrderItemController();

router.post(
  "/",
  authenticateMiddleware,
  validateDtoMiddleware(OrderItemCreateDTO),
  orderItemController.createOrderItem.bind(orderItemController)
);

router.get(
  "/order/:orderId",
  authenticateMiddleware,
  validateIdMiddleware("Order"),
  orderItemController.getOrderItemsByOrderId.bind(orderItemController)
);

export default router;
