import mongoose from "mongoose";
import BadRequestError from "../../../../config/error/bad.request.config";
import { BaseService } from "../../../../librairies/services";
import { IOrderItem } from "../data-access/orderItem.interface";
import { OrderItemRepository } from "../data-access/orderItem.repository";

export class OrderItemService extends BaseService {
  private repository: OrderItemRepository;

  constructor() {
    super("OrderItems");
    this.repository = new OrderItemRepository();
  }

  async createOrderItem(
    data: Omit<IOrderItem, "_id" | "createdAt" | "updatedAt">
  ): Promise<any> {
    // // TODO: Implement transaction for multiple order items creation
    // // Use Mongoose's session feature to ensure atomicity and consistency
    const session = await mongoose.startSession();

    try {
      session.startTransaction();
    } catch (error) {
      throw new BadRequestError({
        message: "Failed to create order items",
        logging: true,
      });
    } finally {
      session.endSession();
    }

    // const session = await mongoose.startSession();
    // session.startTransaction();
    // try {
    //   const createdOrderItems = await this.repository.createOrderItems(data, session);
    //   session.commitTransaction();
    //   return createdOrderItems;
    // } catch (error) {
    //   session.abortTransaction();
    //   throw error;
    // }

    // // Without using a transaction, create order items without atomicity
    // // This may lead to partial order items being created if an error occurs during the creation process
    // // However, this approach is suitable for simpler scenarios or when transactions are not required.
    // const createdOrderItem = this.repository.createOrderItems(data);
    // if (!createdOrderItem) {
    //   throw new BadRequestError({
    //     message: "Failed to create order item",
    //     logging: true,
    //   });
    // }
    // return createdOrderItem;
  }

  async getOrderItemsByOrderId(orderId: string): Promise<IOrderItem[]> {
    const orderItemsList = await this.repository.getItemsByOrderId(orderId);
    if (!orderItemsList) {
      throw new BadRequestError({
        message: "No order items found for the given order",
        logging: true,
      });
    }
    return orderItemsList;
  }
}
