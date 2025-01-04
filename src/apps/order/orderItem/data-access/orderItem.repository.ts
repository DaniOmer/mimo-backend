import mongoose from "mongoose";

import { OrderItemModel } from "./orderItem.model";
import { IOrderItem } from "./orderItem.interface";
import { MongooseRepository } from "../../../../librairies/repositories";

export class OrderItemRepository extends MongooseRepository<IOrderItem> {
  constructor() {
    super(OrderItemModel);
  }

  async createOrderItems(
    orderItemsList: Partial<IOrderItem>[],
    session?: mongoose.ClientSession
  ): Promise<IOrderItem[]> {
    return await this.model.insertMany(orderItemsList, { session });
  }

  async getItemsByOrderId(orderId: string): Promise<IOrderItem[]> {
    return await this.model
      .find({ orderId })
      .populate("product")
      .populate("productVariant")
      .exec();
  }
}
