import BadRequestError from "../../../../config/error/bad.request.config";
import { IOrderItem } from "../data-access/orderItems.interface";
import { OrderItemRepository } from "../data-access/orderItems.repository";

export class OrderItemService {
  private repository: OrderItemRepository;

  constructor() {
    this.repository = new OrderItemRepository();
  }

  async createOrderItem(data: Partial<IOrderItem>): Promise<IOrderItem> {
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