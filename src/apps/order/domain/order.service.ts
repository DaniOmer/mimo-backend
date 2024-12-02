import { BaseService } from "../../../librairies/services";
import { IOrder, OrderRepository } from "../data-access";

export class OrderService extends BaseService {
  private repository: OrderRepository;

  constructor() {
    super("Order");
    this.repository = new OrderRepository();
  }

  async createOrder(data: Partial<IOrder>): Promise<IOrder> {
    return this.repository.create(data);
  }

  async getOrderById(id: string): Promise<IOrder> {
    const order = await this.repository.getById(id);
    return this.validateDataExists(order, id);
  }

  async getAllOrders(): Promise<IOrder[]> {
    return this.repository.getAll();
  }

  async updateOrderById(
    id: string,
    updates: Partial<IOrder>
  ): Promise<IOrder> {
    const updatedOrder = await this.repository.updateById(id, updates);
    return this.validateDataExists(updatedOrder, id);
  }

  async deleteOrderById(id: string): Promise<IOrder> {
    const deletedOrder = await this.repository.deleteById(id);
    return this.validateDataExists(deletedOrder, id);
  }
}