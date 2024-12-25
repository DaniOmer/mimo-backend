import { Request, Response, NextFunction } from "express";
import { OrderService } from "../domain/order.service";
import { ApiResponse } from "../../../../librairies/controllers/api.response";
import BadRequestError from "../../../../config/error/bad.request.config";

export class OrderController {
  readonly orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  async createOrderFromCart(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const currentUser = req.user;
      const data = req.body;
      const createdOrder = await this.orderService.createOrderFromCart(
        data,
        currentUser
      );
      ApiResponse.success(res, "Order created successfully", createdOrder, 201);
    } catch (error) {
      next(error);
    }
  }

  async getAllOrders(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user.id;
      const orders = await this.orderService.getOrdersByUserId(userId);
      ApiResponse.success(res, "Orders retrieved successfully", orders, 200);
    } catch (error) {
      next(error);
    }
  }

  async getOrderById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const orderId = req.params.id;
      const userId = req.user.id;
      const order = await this.orderService.getOrderById(orderId);
      if (!order || order.user.toString() !== userId) {
        throw new BadRequestError({
          message: "Order does not belong to the authenticated user.",
          logging: true,
        });
      }
      ApiResponse.success(res, "Order retrieved successfully", order, 200);
    } catch (error) {
      next(error);
    }
  }

  async updateOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const orderId = req.params.id;
      const updates = req.body;
      const userId = req.user.id;
      const order = await this.orderService.getOrderById(orderId);
      if (!order || order.user.toString() !== userId) {
        throw new BadRequestError({
          message: "Order does not belong to the authenticated user.",
          logging: true,
        });
      }
      const updatedOrder = await this.orderService.updateOrderById(
        orderId,
        updates
      );
      ApiResponse.success(res, "Order updated successfully", updatedOrder, 200);
    } catch (error) {
      next(error);
    }
  }

  async deleteOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const orderId = req.params.id;
      const userId = req.user.id;
      const order = await this.orderService.getOrderById(orderId);
      if (!order || order.user.toString() !== userId) {
        throw new BadRequestError({
          message: "Order does not belong to the authenticated user.",
          logging: true,
        });
      }
      await this.orderService.deleteOrderById(orderId);
      ApiResponse.success(res, "Order deleted successfully", null, 204);
    } catch (error) {
      next(error);
    }
  }
}
