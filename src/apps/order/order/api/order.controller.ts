import { Request, Response, NextFunction } from "express";
import { OrderService } from "../domain/order.service";
import { ApiResponse } from "../../../../librairies/controllers/api.response";

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

  async getAllOrdersByUser(
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
      const currentUser = req.user;
      const order = await this.orderService.getOrderById(orderId, currentUser);
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
      const data = req.body;
      const currentUser = req.user;
      const updatedOrder = this.orderService.updateOrderById(
        orderId,
        data,
        currentUser
      );
      ApiResponse.success(res, "Order updated successfully", updatedOrder, 200);
    } catch (error) {
      next(error);
    }
  }
}
