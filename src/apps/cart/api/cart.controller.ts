import { Request, Response, NextFunction } from "express";
import { CartService } from "../domain/cart.service";
import { ApiResponse } from "../../../librairies/controllers/api.response";
import BaseController from "../../../librairies/controllers/base.controller";

export class CartController extends BaseController {
  private cartService: CartService;

  constructor() {
    super()
    this.cartService = new CartService();
  }

  async getCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cart = await this.cartService.getCartByUserId(req.user.id);
      ApiResponse.success(res, "Cart retrieved successfully", cart, 200);
    } catch (error) {
      next(error);
    }
  }

  async updateCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updatedCart = await this.cartService.updateCartByUserId(req.user.id, req.body);
      ApiResponse.success(res, "Cart updated successfully", updatedCart, 200);
    } catch (error) {
      next(error);
    }
  }

  async deleteCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.cartService.deleteCartByUserId(req.user.id);
      ApiResponse.success(res, "Cart deleted successfully", null, 204);
    } catch (error) {
      next(error);
    }
  }
}