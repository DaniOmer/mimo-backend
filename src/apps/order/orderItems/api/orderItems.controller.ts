import { Request, Response, NextFunction } from "express";
import { OrderItemService } from "../domain/orderItems.service";
import { ApiResponse } from "../../../../librairies/controllers/api.response";

export class OrderItemController {
  private orderItemService: OrderItemService;

  constructor() {
    this.orderItemService = new OrderItemService();
  }

  async createOrderItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orderItem = await this.orderItemService.createOrderItem(req.body);
      ApiResponse.success(res, "OrderItem created successfully", orderItem, 201);
    } catch (error) {
      next(error);
    }
  }

  async getOrderItemsByOrderId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orderItems = await this.orderItemService.getOrderItemsByOrderId(req.params.orderId);
      ApiResponse.success(res, "OrderItems retrieved successfully", orderItems, 200);
    } catch (error) {
      next(error);
    }
  }

  async deleteOrderItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const deletedOrderItem = await this.orderItemService.deleteOrderItem(req.params.id);
      ApiResponse.success(res, "OrderItem deleted successfully", deletedOrderItem, 204);
    } catch (error) {
      next(error);
    }
  }
}