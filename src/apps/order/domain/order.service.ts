import BadRequestError from "../../../config/error/bad.request.config";
import { BaseService } from "../../../librairies/services";
import { IOrder, OrderRepository } from "../data-access";
import { OrderCreateDTO } from "./order.dto";

export class OrderService extends BaseService {
  private repository: OrderRepository;

  constructor() {
    super("Order");
    this.repository = new OrderRepository();
  }

  async createOrder(data: OrderCreateDTO): Promise<IOrder> {
    return this.repository.create(data);
  }

  async getOrderById(id: string): Promise<IOrder> {
    const order = await this.repository.getById(id);
    if (!order) {
      throw new BadRequestError({
        message: `Order with ID ${id} not found`,
        context: { orderId: id },
        logging: true,
      });
    }
    return order;
  }

  async getAllOrders(): Promise<IOrder[]> {
    return this.repository.getAll();
  }

  async updateOrderById(
    id: string,
    updates: Partial<IOrder>
  ): Promise<IOrder> {
    const updatedOrder = await this.repository.updateById(id, updates);
    if (!updatedOrder) {
      throw new BadRequestError({
        message: `Order with ID ${id} not found or failed to update`,
        context: { orderId: id, updates },
        logging: true,
      });
    }
    return updatedOrder;
  }

  async deleteOrderById(id: string): Promise<IOrder> {
    const deletedOrder = await this.repository.deleteById(id);
    if (!deletedOrder) {
      throw new BadRequestError({
        message: `Order with ID ${id} not found for deletion`,
        context: { orderId: id },
        logging: true,
      });
    }
    return deletedOrder;
  }
}