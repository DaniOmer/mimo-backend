import { Request, Response, NextFunction } from "express";
import { OrderService } from "../domain/order.service";
import { ApiResponse } from "../../../librairies/controllers/api.response";
import BaseController from "../../../librairies/controllers/base.controller";

export class OrderController extends BaseController {
  private orderService: OrderService;

  constructor() {
    super();
    this.orderService = new OrderService();
  }

  async createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const newOrder = await this.orderService.create(req.body);
      ApiResponse.success(res, "Order created successfully", newOrder, 201);
    } catch (error) {
      next(error);
    }
  }

  async getAllOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orders = await this.orderService.getAll();
      ApiResponse.success(res, "Orders retrieved successfully", orders, 200);
    } catch (error) {
      next(error);
    }
  }

  async getOrderById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const order = await this.orderService.getById(req.params.id);
      ApiResponse.success(res, "Order retrieved successfully", order, 200);
    } catch (error) {
      next(error);
    }
  }

  async updateOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orderId = req.params.id;
      const updates = req.body;
      const updatedOrder = await this.orderService.updateById(orderId, updates);
      ApiResponse.success(res, "Order updated successfully", updatedOrder, 200);
    } catch (error) {
      next(error);
    }
  }

  async deleteOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orderId = req.params.id;
      await this.orderService.deleteById(orderId);
      ApiResponse.success(res, "Order deleted successfully", null, 204);
    } catch (error) {
      next(error);
    }
  }
}