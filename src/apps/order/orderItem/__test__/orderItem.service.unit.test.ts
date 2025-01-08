import { OrderItemService } from "../domain/orderItem.service";
import { OrderItemRepository } from "../data-access/orderItem.repository";
import { IOrderItem } from "../data-access/orderItem.interface";
import BadRequestError from "../../../../config/error/bad.request.config";
import { jest } from "@jest/globals";

describe("OrderItemService", () => {
  let orderItemService: OrderItemService;
  let mockOrderItemRepository: jest.Mocked<OrderItemRepository>;

  beforeEach(() => {
    mockOrderItemRepository = {
      createOrderItems: jest.fn(),
      getItemsByOrderId: jest.fn(),
    } as unknown as jest.Mocked<OrderItemRepository>;

    orderItemService = new OrderItemService();
    (orderItemService as any).repository = mockOrderItemRepository;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createManyOrderItems", () => {
    it("should create multiple order items successfully", async () => {
      const mockData = [
        {
          product: "product123",
          productVariant: "variant123",
          order: "order123",
          quantity: 2,
          priceEtx: 50,
          priceVat: 10,
          subTotalEtx: 100,
          subTotalVat: 20,
        },
      ];

      const mockCreatedItems: Partial<IOrderItem>[] = [
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
        },
      ];

      mockOrderItemRepository.createOrderItems.mockResolvedValue(
        mockCreatedItems as any
      );

      const result = await orderItemService.createManyOrderItems(mockData);

      expect(mockOrderItemRepository.createOrderItems).toHaveBeenCalledWith(
        mockData
      );
      expect(result).toEqual(mockCreatedItems);
    });

    it("should throw BadRequestError if repository fails", async () => {
      const mockData = [
        {
          product: "product123",
          productVariant: "variant123",
          order: "order123",
          quantity: 2,
          priceEtx: 50,
          priceVat: 10,
          subTotalEtx: 100,
          subTotalVat: 20,
        },
      ];

      mockOrderItemRepository.createOrderItems.mockRejectedValue(new Error());

      await expect(
        orderItemService.createManyOrderItems(mockData)
      ).rejects.toThrow(BadRequestError);

      expect(mockOrderItemRepository.createOrderItems).toHaveBeenCalledWith(
        mockData
      );
    });
  });

  describe("getOrderItemsByOrderId", () => {
    it("should return order items for a given order ID", async () => {
      const mockOrderItems: Partial<IOrderItem>[] = [
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
        },
      ];

      mockOrderItemRepository.getItemsByOrderId.mockResolvedValue(
        mockOrderItems as any
      );

      const result = await orderItemService.getOrderItemsByOrderId("order123");

      expect(mockOrderItemRepository.getItemsByOrderId).toHaveBeenCalledWith(
        "order123"
      );
      expect(result).toEqual(mockOrderItems);
    });

    it("should throw BadRequestError if no items are found", async () => {
      mockOrderItemRepository.getItemsByOrderId.mockResolvedValue(null);

      await expect(
        orderItemService.getOrderItemsByOrderId("order123")
      ).rejects.toThrow(BadRequestError);

      expect(mockOrderItemRepository.getItemsByOrderId).toHaveBeenCalledWith(
        "order123"
      );
    });
  });
});
