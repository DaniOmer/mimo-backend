import { Types } from "mongoose";
import BadRequestError from "../../../../config/error/bad.request.config";
import { BaseService } from "../../../../librairies/services";
import { IOrder, OrderModel, OrderRepository } from "../data-access";
import { OrderCreateFromCartDTO } from "./order.dto";
import { UserDataToJWT } from "../../../../utils/security.utils";
import { CartService } from "../../cart/domain";

export class OrderService extends BaseService {
  readonly repository: OrderRepository;
  readonly cartService: CartService;

  constructor() {
    super("Order");
    this.repository = new OrderRepository();
    this.cartService = new CartService();
  }

  async createOrderFromCart(
    data: OrderCreateFromCartDTO,
    user: UserDataToJWT
  ): Promise<void> {
    const cart = await this.cartService.getCartById(data.cartId);
    if (cart.items.length <= 0) {
      throw new BadRequestError({
        message: "Cart is empty, cannot create an order",
        logging: true,
      });
    }
    const totalPriceEtx = cart.items.reduce(
      (sum, item) => sum + item.priceEtx * item.quantity,
      0
    );
    const totalPriceVat = cart.items.reduce(
      (sum, item) => sum + item.priceVat * item.quantity,
      0
    );
    // return this.repository.create(data);
  }

  async getOrderById(id: string): Promise<IOrder> {
    const order = await this.repository.getById(id);
    if (!order) {
      throw new BadRequestError({
        message: `Order with ID ${id} not found`,
        context: { orderId: id },
        logging: true,
      });
    }
    return order;
  }

  async updateOrderById(
    id: string,
    updates: Omit<IOrder, "_id" | "orderDate" | "user">
  ): Promise<IOrder> {
    const updatedOrder = await this.repository.updateById(id, updates);
    if (!updatedOrder) {
      throw new BadRequestError({
        message: `Order with ID ${id} not found or failed to update`,
        context: { orderId: id, updates },
        logging: true,
      });
    }
    return updatedOrder;
  }

  async deleteOrderById(id: string): Promise<IOrder> {
    const deletedOrder = await this.repository.deleteById(id);
    if (!deletedOrder) {
      throw new BadRequestError({
        message: `Order with ID ${id} not found for deletion`,
        context: { orderId: id },
        logging: true,
      });
    }
    return deletedOrder;
  }

  async getOrdersByUserId(userId: string): Promise<IOrder[]> {
    try {
      const userObjectId = new Types.ObjectId(userId);

      const orders = await OrderModel.find({ userId: userObjectId }).exec();

      return orders;
    } catch (error) {
      throw new Error("Error fetching orders for user");
    }
  }
}
