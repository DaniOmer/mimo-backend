import { Request, Response, NextFunction } from "express";
import { CartService } from "../domain/cart.service";
import { ApiResponse } from "../../../../librairies/controllers/api.response";
import BadRequestError from "../../../../config/error/bad.request.config";
import BaseController from "../../../../librairies/controllers/base.controller";

export class CartController extends BaseController {
  private cartService: CartService;

  constructor() {
    super()
    this.cartService = new CartService();
  }

  async getCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cart = await this.cartService.getCartByUserId(req.user.id);
      if (!cart || cart.user.toString() !== req.user.id) {
        throw new BadRequestError({
          message: "Cart does not belong to the authenticated user.",
          logging: true
        });
      }
      ApiResponse.success(res, "Cart retrieved successfully", cart, 200);
    } catch (error) {
      next(error);
    }
  }

  async updateCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updatedCart = await this.cartService.updateCartByUserId(req.user.id, req.body);
      if (!updatedCart || updatedCart.user.toString() !== req.user.id) {
        throw new BadRequestError({
          message: "Cart does not belong to the authenticated user.",
          logging: true
        });
      }
      ApiResponse.success(res, "Cart updated successfully", updatedCart, 200);
    } catch (error) {
      next(error);
    }
  }

  async deleteCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cart = await this.cartService.getCartByUserId(req.user.id);
      if (!cart || cart.user.toString() !== req.user.id) {
        throw new BadRequestError({
          message: "Cart does not belong to the authenticated user.",
          logging: true
        });
      }
      await this.cartService.deleteCartByUserId(req.user.id);
      ApiResponse.success(res, "Cart deleted successfully", null, 204);
    } catch (error) {
      next(error);
    }
  }
}