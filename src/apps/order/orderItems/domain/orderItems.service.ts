import BadRequestError from "../../../../config/error/bad.request.config";
import { BaseService } from "../../../../librairies/services";
import { IOrderItem } from "../data-access/orderItems.interface";
import { OrderItemRepository } from "../data-access/orderItems.repository";
import { OrderItemCreateDTO } from "./orderItems.dto";

export class OrderItemService extends BaseService {
  private repository: OrderItemRepository;

  constructor() {
    super("OrderItems");
    this.repository = new OrderItemRepository();
  }

  async createOrderItem(data: OrderItemCreateDTO): Promise<IOrderItem> {
    return this.repository.create(data);
  }

  async getOrderItemsByOrderId(orderId: string): Promise<IOrderItem[]> {
    return this.repository.getByOrderId(orderId);
  }

  async deleteOrderItem(id: string): Promise<IOrderItem | null> {
    const orderItem = await this.repository.getById(id);
    if (!orderItem) {
      throw new BadRequestError({
        message: `OrderItem with ID ${id} not found`,
        context: { orderItemId: id },
        logging: true,
      });
    }
    return this.repository.deleteById(id);
  }
}