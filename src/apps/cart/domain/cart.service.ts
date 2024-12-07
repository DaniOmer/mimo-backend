import { BaseService } from "../../../librairies/services";
import { CartModel } from "../data-access/cart.model";
import { ICart } from "../data-access/cart.interface";
import BadRequestError from "../../../config/error/bad.request.config";

export class CartService extends BaseService {
  constructor() {
    super("Cart");
  }

  async createCart(data: Partial<ICart>): Promise<ICart> {
    return CartModel.create(data);
  }

  async getCartByUserId(userId: string): Promise<ICart> {
    const cart = await CartModel.findOne({ userId });
    if (!cart) {
      throw new BadRequestError({
        message: `Cart for user with ID ${userId} not found`,
        context: { userId },
        logging: true,
      });
    }
    return cart;
  }

  async updateCartByUserId(userId: string, updates: Partial<ICart>): Promise<ICart> {
    const updatedCart = await CartModel.findOneAndUpdate({ userId }, updates, { new: true });
    if (!updatedCart) {
      throw new BadRequestError({
        message: `Cart for user with ID ${userId} not found or failed to update`,
        context: { userId, updates },
        logging: true,
      });
    }
    return updatedCart;
  }

  async deleteCartByUserId(userId: string): Promise<ICart> {
    const deletedCart = await CartModel.findOneAndDelete({ userId });
    if (!deletedCart) {
      throw new BadRequestError({
        message: `Cart for user with ID ${userId} not found`,
        context: { userId },
        logging: true,
      });
    }
    return deletedCart;
  }
}