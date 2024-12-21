import { Request, Response, NextFunction } from "express";
import { OrderItemService } from "../domain/orderItems.service";
import { ApiResponse } from "../../../../librairies/controllers/api.response";
import { OrderService } from "../../order/domain";
import BadRequestError from "../../../../config/error/bad.request.config";

export class OrderItemController {
  private orderItemService: OrderItemService;
  private orderService: OrderService;

  constructor() {
    this.orderItemService = new OrderItemService();
    this.orderService = new OrderService();
  }

  async createOrderItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orderId = req.body.orderId;
      const userId = req.user.id;
      const order = await this.orderService.getOrderById(orderId);
      if (!order || order.user.toString() !== userId) {
        throw new BadRequestError({
          message: "Order does not belong to the authenticated user.",
          logging: true,
        });
      }
      const orderItem = await this.orderItemService.createOrderItem(req.body);
      ApiResponse.success(res, "OrderItem created successfully", orderItem, 201);
    } catch (error) {
      next(error);
    }
  }

  async getOrderItemsByOrderId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orderId = req.body.orderId;
      const userId = req.user.id;
      const order = await this.orderService.getOrderById(orderId);
      if (!order || order.user.toString() !== userId) {
        throw new BadRequestError({
          message: "Order does not belong to the authenticated user.",
          logging: true,
        });
      }
      const orderItems = await this.orderItemService.getOrderItemsByOrderId(req.params.orderId);
      ApiResponse.success(res, "OrderItems retrieved successfully", orderItems, 200);
    } catch (error) {
      next(error);
    }
  }

  async deleteOrderItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orderId = req.body.orderId;
      const userId = req.user.id;
      const order = await this.orderService.getOrderById(orderId);
      if (!order || order.user.toString() !== userId) {
        throw new BadRequestError({
          message: `Order does not belong to the authenticated user.`,
          logging: true,
        });
      }
      const deletedOrderItem = await this.orderItemService.deleteOrderItem(req.params.id);
      ApiResponse.success(res, "OrderItem deleted successfully", deletedOrderItem, 204);
    } catch (error) {
      next(error);
    }
  }
}