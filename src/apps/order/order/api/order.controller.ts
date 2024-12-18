import { Request, Response, NextFunction } from "express";
import { OrderService } from "../domain/order.service";
import { ApiResponse } from "../../../../librairies/controllers/api.response";

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  async createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const newOrder = await this.orderService.createOrder(req.body);
      ApiResponse.success(res, "Order created successfully", newOrder, 201);
    } catch (error) {
      next(error);
    }
  }

  async getAllOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orders = await this.orderService.getAllOrders();
      ApiResponse.success(res, "Orders retrieved successfully", orders, 200);
    } catch (error) {
      next(error);
    }
  }

  async getOrderById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const order = await this.orderService.getOrderById(req.params.id);
      ApiResponse.success(res, "Order retrieved successfully", order, 200);
    } catch (error) {
      next(error);
    }
  }

  async updateOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orderId = req.params.id;
      const updates = req.body;
      const updatedOrder = await this.orderService.updateOrderById(orderId, updates);
      ApiResponse.success(res, "Order updated successfully", updatedOrder, 200);
    } catch (error) {
      next(error);
    }
  }

  async deleteOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orderId = req.params.id;
      await this.orderService.deleteOrderById(orderId);
      ApiResponse.success(res, "Order deleted successfully", null, 204);
    } catch (error) {
      next(error);
    }
  }
}