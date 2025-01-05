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

  async getAllOrdersByStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const status = req.params.status;
      const orders = await this.orderService.getOrdersByStatus(status);
      ApiResponse.success(res, "Orders retrieved successfully", orders, 200);
    } catch (error) {
      next(error);
    }
  }

  async getOrderByNumber(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const orderNumber = req.params.number;
      const currentUser = req.user;
      const order = await this.orderService.getOrderByNumber(
        orderNumber,
        currentUser
      );
      ApiResponse.success(res, "Order retrieved successfully", order, 200);
    } catch (error) {
      next(error);
    }
  }

  async getRevenueAnalytics(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { startDate, endDate } = req.query;
      const start = new Date(startDate as string);
      const end = new Date(endDate as string);

      const analytics = await this.orderService.getRevenueAnalytics(start, end);
      ApiResponse.success(res, "Revenue analytics retrieved successfully", analytics, 200);
    } catch (error) {
      next(error);
    }
  }

  async getSalesByCategoryAnalytics(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { startDate, endDate } = req.query;
      const start = new Date(startDate as string);
      const end = new Date(endDate as string);

      const analytics = await this.orderService.getSalesByCategoryAnalytics(start, end);
      ApiResponse.success(res, "Sales by category analytics retrieved successfully", analytics, 200);
    } catch (error) {
      next(error);
    }
  }

  async getSalesByProductAnalytics(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { startDate, endDate } = req.query;
      const start = new Date(startDate as string);
      const end = new Date(endDate as string);
  
      const analytics = await this.orderService.getSalesByProductAnalytics(start, end);
      ApiResponse.success(res, "Sales by product analytics retrieved successfully", analytics, 200);
    } catch (error) {
      next(error);
    }
  }

  async getAverageCartValueAnalytics(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { startDate, endDate } = req.query;
      const start = new Date(startDate as string);
      const end = new Date(endDate as string);
  
      const analytics = await this.orderService.getAverageCartValue(start, end);
      ApiResponse.success(res, "Average cart value analytics retrieved successfully", analytics, 200);
    } catch (error) {
      next(error);
    }
  }

  async getNewCustomersAnalytics(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { startDate, endDate } = req.query;
      const start = new Date(startDate as string);
      const end = new Date(endDate as string);
  
      const analytics = await this.orderService.getNewCustomersAnalytics(start, end);
      ApiResponse.success(res, "New customers analytics retrieved successfully", analytics, 200);
    } catch (error) {
      next(error);
    }
  }
}
