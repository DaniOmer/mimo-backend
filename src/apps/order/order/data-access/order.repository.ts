import { IOrder } from "./order.interface";
import { OrderModel } from "./order.model";
import { MongooseRepository } from "../../../../librairies/repositories/mongoose/mongoose.repository";

export class OrderRepository extends MongooseRepository<IOrder> {
  constructor() {
    super(OrderModel);
  }

  async getOrdersByUserId(userId: string): Promise<IOrder[]> {
    return await OrderModel.find({ user: userId }).exec();
  }
}
