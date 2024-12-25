import { Router } from "express";
import { CartController } from "./cart.controller";
import {
  validateDtoMiddleware,
  authenticateMiddleware,
} from "../../../../librairies/middlewares";
import { CartItemDTO } from "../domain/cart.dto";

const router = Router();
const cartController = new CartController();

router.get(
  "/me",
  authenticateMiddleware,
  cartController.getCurrentUserCart.bind(cartController)
);

router.post(
  "/add-product",
  authenticateMiddleware,
  validateDtoMiddleware(CartItemDTO),
  cartController.addProductToCart.bind(cartController)
);

router.delete(
  "/",
  authenticateMiddleware,
  cartController.deleteCart.bind(cartController)
);

export default router;
