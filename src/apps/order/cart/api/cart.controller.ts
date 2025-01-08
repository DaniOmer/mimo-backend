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
      const currentUser = req.user;
      const data = req.body;
      await this.cartService.addItemToCart(data, currentUser);
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
      const cartItemId = req.params.id;
      const currentUser = req.user;
      const data = req.body;
      await this.cartService.updateCartItemQuantity(
        cartItemId,
        data,
        currentUser
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
      await this.cartService.clearCartForCancel(cartId, currentUser);
      ApiResponse.success(res, "Cart cleared successfully", null, 200);
    } catch (error) {
      next(error);
    }
  }

  async removeItemFromCart(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const cartItemId = req.params.id;
      const currentUser = req.user;
      await this.cartService.removeItemFromCart(cartItemId, currentUser);
      ApiResponse.success(
        res,
        "Item removed from cart successfully",
        null,
        200
      );
    } catch (error) {
      next(error);
    }
  }
}
