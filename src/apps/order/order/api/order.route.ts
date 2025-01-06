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


router.get(
  "/",
  authenticateMiddleware,
  checkRoleMiddleware(["admin"]),
  orderController.getAllOrders.bind(orderController)
);

router.patch(
  "/:id/status",
  authenticateMiddleware,
  validateIdMiddleware("Order"),
  checkRoleMiddleware(["admin"]),
  orderController.updateOrderStatus.bind(orderController)
);



export default router;
