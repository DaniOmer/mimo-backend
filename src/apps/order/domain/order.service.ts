import { IOrder } from "../data-access/order.interface";
import { MongooseRepository } from "../../../librairies/repositories/mongoose/mongoose.repository";
import { OrderModel } from "../data-access/order.model";

export class OrderService extends MongooseRepository<IOrder> {
  constructor() {
    super(OrderModel);
  }
}