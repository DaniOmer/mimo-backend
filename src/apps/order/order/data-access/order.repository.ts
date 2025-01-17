import { IOrder, OrderStatus } from "./order.interface";
import { OrderModel } from "./order.model";
import { MongooseRepository } from "../../../../librairies/repositories/mongoose/mongoose.repository";

export class OrderRepository extends MongooseRepository<IOrder> {
  constructor() {
    super(OrderModel);
  }

  async getOrdersByUserId(userId: string): Promise<IOrder[]> {
    return await OrderModel.find({ user: userId })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate("shippingAddress")
      .populate("billingAddress")
      .exec();
  }

  async getOrderByNumber(number: string): Promise<IOrder | null> {
    return await this.model
      .findOne({ number })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate("shippingAddress")
      .populate("billingAddress");
  }

  async getOrdersByStatus(status: OrderStatus): Promise<IOrder[]> {
    return await this.model
      .find({ status })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate("shippingAddress")
      .populate("billingAddress");
  }

  async getPaidOrdersWithinDateRange(startDate: Date, endDate: Date): Promise<IOrder[]> {
    return await OrderModel.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate
      },
      status: { $in: ["completed", "shipped", "delivered"] }
    })
    .populate({
      path: "user",
      select: "-password",
    })
    .populate("shippingAddress")
    .populate("billingAddress")
    .exec();
  }

  async getAllOrdersWithPopulation(): Promise<IOrder[]> {
    return await this.model
      .find({})
      .populate({
        path: "user",
        select: "-password -roles", 
      })
      .populate("shippingAddress")
      .populate("billingAddress")
      .exec();
  }
}
