import { IOrder } from "./order.interface";
import { OrderModel } from "./order.model";
import { MongooseRepository } from "../../../../librairies/repositories/mongoose/mongoose.repository";
import { OrderCreateDTO } from "../domain";

export class OrderRepository {
  async create(data: OrderCreateDTO): Promise<IOrder> {
    const order = new OrderModel(data);
    return order.save();
  }

  async getById(id: string): Promise<IOrder | null> {
    return OrderModel.findById(id).populate('orderItems').populate('user').exec(); // Assuming you want to populate related fields
  }

  async getByUserId(userId: string): Promise<IOrder[]> {
    return OrderModel.find({ user: userId }).populate('orderItems').exec(); // Populate orderItems if necessary
  }

  async updateById(id: string, updates: Partial<IOrder>): Promise<IOrder | null> {
    return OrderModel.findByIdAndUpdate(id, updates, { new: true }).exec();
  }

  async deleteById(id: string): Promise<IOrder | null> {
    return OrderModel.findByIdAndDelete(id).exec();
  }
}