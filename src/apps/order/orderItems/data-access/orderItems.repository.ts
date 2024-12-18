import { OrderItemModel } from "./orderItems.model";
import { IOrderItem } from "./orderItems.interface";

export class OrderItemRepository {
  async create(data: Partial<IOrderItem>): Promise<IOrderItem> {
    const orderItem = new OrderItemModel(data);
    return orderItem.save();
  }

  async getByOrderId(orderId: string): Promise<IOrderItem[]> {
    return OrderItemModel.find({ orderId }).exec();
  }

  async getById(id: string): Promise<IOrderItem | null> {
    return OrderItemModel.findById(id).exec();
  }

  async deleteById(id: string): Promise<IOrderItem | null> {
    return OrderItemModel.findByIdAndDelete(id).exec();
  }
}