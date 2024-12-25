import { Request, Response, NextFunction } from "express";
import { CartService } from "../domain/cart.service";
import { ApiResponse } from "../../../../librairies/controllers/api.response";
import { BaseController } from "../../../../librairies/controllers";

export class CartController extends BaseController {
  readonly cartService: CartService;

  constructor() {
    super();
    this.cartService = new CartService();
  }

  async getCurrentUserCart(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const currentUserId = req.user.id;
      const cart = await this.cartService.getCartByUser(currentUserId);
      ApiResponse.success(res, "Cart retrieved successfully", cart, 200);
    } catch (error) {
      next(error);
    }
  }

  async addProductToCart(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const currentUserId = req.user.id;
      const { productId, productVariantId, quantity } = req.body;
      await this.cartService.addItemToCart(
        { productId, productVariantId, quantity },
        currentUserId
      );
      ApiResponse.success(res, "Item added to cart successfully", null, 201);
    } catch (error) {
      next(error);
    }
  }

  async updateCartItemQuantity(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const currentUser = req.user;
      const { cartId, productId, productVariantId, newQuantity } = req.body;
      await this.cartService.updateCartItemQuantity(
        currentUser,
        cartId,
        productId,
        productVariantId,
        newQuantity
      );
      ApiResponse.success(
        res,
        "Cart item quantity updated successfully",
        null,
        200
      );
    } catch (error) {
      next(error);
    }
  }

  async removeAllProductsFromCart(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const currentUser = req.user;
      const { cartId } = req.body;
      await this.cartService.clearCart(currentUser, cartId);
      ApiResponse.success(res, "Cart cleared successfully", null, 200);
    } catch (error) {
      next(error);
    }
  }
}
