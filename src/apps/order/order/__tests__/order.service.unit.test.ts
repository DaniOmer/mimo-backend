import { OrderService } from "../domain/order.service";
import { OrderRepository, OrderStatus } from "../data-access";
import { CartService } from "../../cart/domain";
import { AddressService } from "../../../address/domain";
import { ProductService } from "../../../product/domain";
import { ProductVariantService } from "../../../product/domain";
import { InventoryService } from "../../../product/domain/inventory/inventory.service";
import { OrderItemService } from "../../orderItem/domain";
import { UserRepository } from "../../../auth/data-access";
import { IOrder } from "../data-access/order.interface";
import { IOrderItem } from "../../orderItem/data-access/orderItem.interface";
import BadRequestError from "../../../../config/error/bad.request.config";
import { jest } from "@jest/globals";

describe("OrderService", () => {
  let orderService: OrderService;
  let mockOrderRepository: jest.Mocked<OrderRepository>;
  let mockCartService: jest.Mocked<CartService>;
  let mockAddressService: jest.Mocked<AddressService>;
  let mockOrderItemService: jest.Mocked<OrderItemService>;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockOrderRepository = {
      create: jest.fn(),
      getById: jest.fn(),
      updateById: jest.fn(),
      getOrdersByUserId: jest.fn(),
      getOrdersByStatus: jest.fn(),
      getOrderByNumber: jest.fn(),
      getPaidOrdersWithinDateRange: jest.fn(),
      getAllOrdersWithPopulation: jest.fn(),
    } as unknown as jest.Mocked<OrderRepository>;

    mockCartService = {
      getCartById: jest.fn(),
      checkCartOwner: jest.fn(),
      setCartExpiration: jest.fn(),
      clearCartForOrder: jest.fn(),
    } as unknown as jest.Mocked<CartService>;

    mockAddressService = {
      getAddressById: jest.fn(),
    } as unknown as jest.Mocked<AddressService>;

    mockOrderItemService = {
      getOrderItemsByOrderId: jest.fn(),
      createManyOrderItems: jest.fn(),
    } as unknown as jest.Mocked<OrderItemService>;

    mockUserRepository = {
      getById: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    orderService = new OrderService();
    orderService.repository = mockOrderRepository;
    orderService.cartService = mockCartService;
    orderService.addressService = mockAddressService;
    orderService.orderItemService = mockOrderItemService;
    orderService.userRepository = mockUserRepository;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createOrderFromCart", () => {
    it("should create an order from the cart", async () => {
      const mockCart = {
        _id: "cart123",
        items: [
          {
            product: "product123",
            productVariant: "variant123",
            priceEtx: 100,
            priceVat: 20,
            quantity: 2,
          },
        ],
      };

      const mockOrder: Partial<IOrder> = {
        user: "user123",
        shippingAddress: "address123",
        billingAddress: "address456",
        status: OrderStatus.Pending,
        amountEtx: 200,
        amountVat: 40,
      };

      const mockOrderItem: Partial<IOrderItem>[] = [
        {
          _id: "item123",
          product: "product123",
          productVariant: "variant123",
          order: "order123",
          quantity: 2,
          priceEtx: 100,
          priceVat: 20,
          subTotalEtx: 200,
          subTotalVat: 40,
        },
      ];

      mockCartService.getCartById.mockResolvedValue(mockCart as any);
      mockOrderRepository.create.mockResolvedValue(mockOrder as any);
      mockOrderItemService.createManyOrderItems.mockResolvedValue(
        mockOrderItem as any
      );

      const result = await orderService.createOrderFromCart(
        { cartId: "cart123", billingAddressId: "address123", shippingAddressId: "address456" },
        { _id: "user123" } as any
      );

      expect(mockCartService.getCartById).toHaveBeenCalledWith("cart123");
      expect(mockOrderRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          user: "user123",
          shippingAddress: "address123",
          billingAddress: "address456",
          status: OrderStatus.Pending,
        })
      );
      expect(result).toEqual(
        expect.objectContaining({
          items: mockOrderItem,
        })
      );
    });

    it("should throw an error if cart is empty", async () => {
      mockCartService.getCartById.mockResolvedValue({ items: [] } as any);

      await expect(
        orderService.createOrderFromCart(
          { cartId: "cart123", billingAddressId: "address123", shippingAddressId: "address456" },
          { _id: "user123" } as any
        )
      ).rejects.toThrow(BadRequestError);

      expect(mockCartService.getCartById).toHaveBeenCalledWith("cart123");
    });
  });

  describe("getOrderById", () => {
    it("should return an order by its ID", async () => {
      const mockOrder: Partial<IOrder> = {
        _id: "order123",
        user: "user123",
        status: OrderStatus.Pending,
      };

      const mockOrderItems: Partial<IOrderItem>[] = [
        {
          _id: "item123",
          product: "product123",
          productVariant: "variant123",
          order: "order123",
          quantity: 2,
          priceEtx: 100,
          priceVat: 20,
          subTotalEtx: 200,
          subTotalVat: 40,
        },
      ];

      mockOrderRepository.getById.mockResolvedValue(mockOrder as any);
      mockOrderItemService.getOrderItemsByOrderId.mockResolvedValue(
        mockOrderItems as any
      );

      const result = await orderService.getOrderById("order123", {
        _id: "user123",
      } as any);

      expect(mockOrderRepository.getById).toHaveBeenCalledWith("order123");
      expect(result).toEqual(
        expect.objectContaining({
          _id: "order123",
          items: mockOrderItems,
        })
      );
    });

    it("should throw an error if order is not found", async () => {
      mockOrderRepository.getById.mockResolvedValue(null);

      await expect(
        orderService.getOrderById("order123", { _id: "user123" } as any)
      ).rejects.toThrow(BadRequestError);

      expect(mockOrderRepository.getById).toHaveBeenCalledWith("order123");
    });
  });
});
