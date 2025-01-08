import { Request, Response, NextFunction } from "express";
import { OrderController } from "../api/order.controller";
import { ApiResponse } from "../../../../librairies/controllers/api.response";
import { OrderStatus, IOrder } from "../data-access/order.interface";
import { IOrderItem } from "../../orderItem/data-access/orderItem.interface";

jest.mock("../domain/order.service");
jest.mock("../../../../librairies/controllers/api.response", () => ({
  ApiResponse: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("OrderController", () => {
  let orderController: OrderController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    orderController = new OrderController();

    req = {
      body: {},
      user: { id: "user123" },
      params: {},
      query: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
    jest.clearAllMocks();
  });

  const mockOrder = {
    _id: "order123",
    user: "user123",
    status: OrderStatus.Pending,
    number: "ORD-12345",
    amountEtx: 100,
    amountVat: 20,
    shippingAddress: "address123",
    billingAddress: "address456",
    createdAt: new Date(),
    updatedAt: new Date(),
    items: [
      {
        _id: "item123",
        product: "product123",
        productVariant: "variant123",
        order: "order123",
        quantity: 2,
        priceEtx: 50,
        priceVat: 10,
        subTotalEtx: 100,
        subTotalVat: 20,
      } as IOrderItem,
    ],
    save: jest.fn(),
    $assertPopulated: jest.fn(),
    $clone: jest.fn(),
    $isDeleted: jest.fn(),
    $isEmpty: jest.fn(),
  };
  
  describe("createOrderFromCart", () => {
    it("should call OrderService.createOrderFromCart and ApiResponse.success", async () => {
      jest
        .spyOn(orderController.orderService, "createOrderFromCart")
        .mockResolvedValue(mockOrder);

      req.body = { cartItems: [{ productId: "prod1", quantity: 2 }] };

      await orderController.createOrderFromCart(
        req as Request,
        res as Response,
        next
      );

      expect(
        orderController.orderService.createOrderFromCart
      ).toHaveBeenCalledWith(req.body, req.user);
      expect(ApiResponse.success).toHaveBeenCalledWith(
        res,
        "Order created successfully",
        mockOrder,
        201
      );
    });

    it("should call next with an error if service fails", async () => {
      const error = new Error("Service failure");
      jest
        .spyOn(orderController.orderService, "createOrderFromCart")
        .mockRejectedValue(error);

      await orderController.createOrderFromCart(
        req as Request,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("getAllOrdersByUser", () => {
    it("should call OrderService.getOrdersByUserId and ApiResponse.success", async () => {
      jest
        .spyOn(orderController.orderService, "getOrdersByUserId")
        .mockResolvedValue([mockOrder]);

      await orderController.getAllOrdersByUser(
        req as Request,
        res as Response,
        next
      );

      expect(orderController.orderService.getOrdersByUserId).toHaveBeenCalledWith(
        "user123"
      );
      expect(ApiResponse.success).toHaveBeenCalledWith(
        res,
        "Orders retrieved successfully",
        [mockOrder],
        200
      );
    });

    it("should call next with an error if service fails", async () => {
      const error = new Error("Service failure");
      jest
        .spyOn(orderController.orderService, "getOrdersByUserId")
        .mockRejectedValue(error);

      await orderController.getAllOrdersByUser(
        req as Request,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("getOrderById", () => {
    it("should call OrderService.getOrderById and ApiResponse.success", async () => {
      jest
        .spyOn(orderController.orderService, "getOrderById")
        .mockResolvedValue(mockOrder);

      req.params = { id: "order123" };

      await orderController.getOrderById(
        req as Request,
        res as Response,
        next
      );

      expect(orderController.orderService.getOrderById).toHaveBeenCalledWith(
        "order123",
        req.user
      );
      expect(ApiResponse.success).toHaveBeenCalledWith(
        res,
        "Order retrieved successfully",
        mockOrder,
        200
      );
    });

    it("should call next with an error if service fails", async () => {
      const error = new Error("Service failure");
      jest
        .spyOn(orderController.orderService, "getOrderById")
        .mockRejectedValue(error);

      req.params = { id: "order123" };

      await orderController.getOrderById(
        req as Request,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("getAllOrders", () => {
    it("should call OrderService.getAllOrders and ApiResponse.success", async () => {
      jest
        .spyOn(orderController.orderService, "getAllOrders")
        .mockResolvedValue([mockOrder]);

      await orderController.getAllOrders(req as Request, res as Response, next);

      expect(orderController.orderService.getAllOrders).toHaveBeenCalled();
      expect(ApiResponse.success).toHaveBeenCalledWith(
        res,
        "Orders retrieved successfully",
        [mockOrder],
        200
      );
    });

    it("should call next with an error if service fails", async () => {
      const error = new Error("Service failure");
      jest
        .spyOn(orderController.orderService, "getAllOrders")
        .mockRejectedValue(error);

      await orderController.getAllOrders(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
