import { Router } from "express";
import { CartController } from "./cart.controller";
import {
  validateDtoMiddleware,
  authenticateMiddleware,
} from "../../../../librairies/middlewares";
import { CartItemCreateDTO, CartItemUpdateDTO } from "../domain/cart.dto";

const router = Router();
const cartController = new CartController();

router.get(
  "/me",
  authenticateMiddleware,
  cartController.getCurrentUserCart.bind(cartController)
);

router.post(
  "/item",
  authenticateMiddleware,
  validateDtoMiddleware(CartItemCreateDTO),
  cartController.addProductToCart.bind(cartController)
);

router.put(
  "/item/:id",
  authenticateMiddleware,
  validateDtoMiddleware(CartItemUpdateDTO),
  cartController.updateCartItemQuantity.bind(cartController)
);

router.delete(
  "/item/:id",
  authenticateMiddleware,
  cartController.removeItemFromCart.bind(cartController)
);

router.post(
  "/clear",
  authenticateMiddleware,
  cartController.removeAllProductsFromCart.bind(cartController)
);

export default router;
