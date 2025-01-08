import BadRequestError from "../../../../config/error/bad.request.config";
import { BaseService } from "../../../../librairies/services";
import { IOrderItem } from "../data-access/orderItem.interface";
import { OrderItemRepository } from "../data-access/orderItem.repository";
import { OrderItemCreateDTO } from "./orderItem.dto";

export class OrderItemService extends BaseService {
  private repository: OrderItemRepository;

  constructor() {
    super("OrderItems");
    this.repository = new OrderItemRepository();
  }

  async createManyOrderItems(data: OrderItemCreateDTO[]): Promise<any> {
    // const session = await mongoose.startSession(); TO IMPLEMENT LATER

    try {
      // session.startTransaction();  TO IMPLEMENT LATER
      // const createdOrderItems = await this.repository.createOrderItems(data, session);
      const createdOrderItems = await this.repository.createOrderItems(data);
      return createdOrderItems;
    } catch (error) {
      // session.abortTransaction();
      throw new BadRequestError({
        message: "Failed to create order items",
        logging: true,
      });
    } finally {
      // session.endSession();
      console.log("END SESSION");
    }
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
