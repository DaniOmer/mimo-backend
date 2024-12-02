import { BaseService } from "../../../librairies/services";
import { CartModel } from "../data-access/cart.model";
import { ICart } from "../data-access/cart.interface";

export class CartService extends BaseService {
  constructor() {
    super("Cart");
  }

  async createCart(data: Partial<ICart>): Promise<ICart> {
    return CartModel.create(data);
  }

  async getCartByUserId(userId: string): Promise<ICart> {
    const cart = await CartModel.findOne({ userId });
    return this.validateDataExists(cart, userId);
  }

  async updateCartByUserId(userId: string, updates: Partial<ICart>): Promise<ICart> {
    const updatedCart = await CartModel.findOneAndUpdate({ userId }, updates, { new: true });
    return this.validateDataExists(updatedCart, userId);
  }

  async deleteCartByUserId(userId: string): Promise<ICart> {
    const deletedCart = await CartModel.findOneAndDelete({ userId });
    return this.validateDataExists(deletedCart, userId);
  }
}