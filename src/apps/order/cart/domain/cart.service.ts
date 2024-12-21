import { BaseService } from "../../../../librairies/services";
import { CartModel } from "../data-access/cart.model";
import { ICart } from "../data-access/cart.interface";
import BadRequestError from "../../../../config/error/bad.request.config";
import { ICartItem } from "../data-access";
import { ObjectId } from "mongodb";
import { OrderItemModel } from "../../orderItems/data-access/orderItems.model";

export class CartService extends BaseService {
  constructor() {
    super("Cart");
  }

  async createCart(data: Partial<ICart>): Promise<ICart> {
    try {
      const cart = await CartModel.create(data);
      return cart;
    } catch (error) {
      throw new BadRequestError({
        message: "Failed to create cart",
        context: { data },
        logging: true,
      });
    }
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

  async addItemToCart(userId: string, orderItemId: string, quantity: number): Promise<ICart> {
    const cart = await this.getCartByUserId(userId);

    const orderItemObjectId = new ObjectId(orderItemId);

    const orderItem = await OrderItemModel.findById(orderItemObjectId);

    if (!orderItem) {
      throw new BadRequestError({
        message: `OrderItem with ID ${orderItemId} not found`,
        context: { orderItemId },
        logging: true,
      });
    }

    const itemPrice = orderItem.priceVat;

    const existingCartItem = cart.items.find(item => item.orderItem.toString() === orderItemId);

    if (existingCartItem) {
      existingCartItem.quantity += quantity;
    } else {
      const newCartItem: ICartItem = {
        orderItem: orderItemObjectId,
        quantity,
        price: itemPrice,
      };
      cart.items.push(newCartItem);
    }

    await this.updateTotalPrice(cart);

    return cart.save();
  }

  async updateCartByUserId(userId: string, updates: { items: ICartItem[] }): Promise<ICart> {
    const cart = await this.getCartByUserId(userId);

    // Updating cart items
    for (const updateItem of updates.items) {
      const existingCartItem = cart.items.find(item => item.orderItem.toString() === updateItem.orderItem.toString());

      if (existingCartItem) {
        existingCartItem.quantity = updateItem.quantity;
      } else {
        const orderItem = await OrderItemModel.findById(updateItem.orderItem);

        if (!orderItem) {
          throw new BadRequestError({
            message: `OrderItem with ID ${updateItem.orderItem} not found`,
            context: { orderItemId: updateItem.orderItem },
            logging: true,
          });
        }

        const itemPrice = orderItem.priceVat;

        const newCartItem: ICartItem = {
          orderItem: updateItem.orderItem,
          quantity: updateItem.quantity,
          price: itemPrice,
        };
        cart.items.push(newCartItem);
      }
    }

    await this.updateTotalPrice(cart);

    return cart.save();
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

  private async updateTotalPrice(cart: ICart): Promise<void> {
    const totalPrice = cart.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  
    cart.totalPrice = totalPrice;
  }
}