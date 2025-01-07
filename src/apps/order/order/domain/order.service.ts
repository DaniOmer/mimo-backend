import BadRequestError from "../../../../config/error/bad.request.config";
import { BaseService } from "../../../../librairies/services";
import { IOrder, OrderRepository, OrderStatus } from "../data-access";
import { OrderCreateFromCartDTO, OrderUpdateDTO } from "./order.dto";
import { SecurityUtils, UserDataToJWT, GeneralUtils } from "../../../../utils";
import {
  CartService,
  IcartResponse,
  CartExpirationType,
} from "../../cart/domain";
import { IAddress } from "../../../address/data-access";
import { AddressService } from "../../../address/domain";
import { ProductService } from "../../../product/domain";
import { ProductVariantService } from "../../../product/domain";
import { InventoryService } from "../../../product/domain/inventory/inventory.service";
import { IOrderItem } from "../../orderItem/data-access";
import { OrderItemService } from "../../orderItem/domain";
import { CategoryRepository, IProduct, IProductVariant, ProductRepository } from "../../../product/data-access";
import { UserRepository } from "../../../auth/data-access";

export class OrderService extends BaseService {
  readonly repository: OrderRepository;
  readonly cartService: CartService;
  readonly addressService: AddressService;
  readonly productService: ProductService;
  readonly productVariantService: ProductVariantService;
  readonly inventoryService: InventoryService;
  readonly orderItemService: OrderItemService;
  readonly userRepository: UserRepository;
  readonly productRepository: ProductRepository;
  readonly categoryRepository: CategoryRepository;

  constructor() {
    super("Order");
    this.repository = new OrderRepository();
    this.cartService = new CartService();
    this.addressService = new AddressService();
    this.productService = new ProductService();
    this.productVariantService = new ProductVariantService();
    this.inventoryService = new InventoryService();
    this.orderItemService = new OrderItemService();
    this.userRepository = new UserRepository();
    this.productRepository = new ProductRepository();
    this.categoryRepository = new CategoryRepository();
  }

  async createOrderFromCart(
    data: OrderCreateFromCartDTO,
    user: UserDataToJWT
  ): Promise<IOrder & { items: IOrderItem[] }> {
    // PRE ORDER PROCESSING
    const { cart, ...order } = await this.preOrder(data, user);

    // ORDER PROCESSING
    const createdOrder = await this.repository.create(order);
    if (!createdOrder) {
      throw new BadRequestError({
        message: "Failed to create order. Please try again.",
        logging: true,
        code: 500,
      });
    }

    // POST ORDER PROCESSING
    const items = await this.postOrder(cart, createdOrder, user);
    return { ...createdOrder.toObject(), items };
  }

  async getOrderById(
    id: string,
    currentUser: UserDataToJWT
  ): Promise<IOrder & { items: IOrderItem[] }> {
    const order = await this.repository.getById(id);
    if (!order) {
      throw new BadRequestError({
        message: `Order with the given id not found`,
        logging: true,
      });
    }
    const orderOwner = order.user.toString();
    const hasAccess = SecurityUtils.isOwnerOrAdmin(orderOwner, currentUser);
    if (!hasAccess) {
      throw new BadRequestError({
        message: "Unauthorized to update this order",
        logging: true,
        code: 403,
      });
    }
    const items = await this.orderItemService.getOrderItemsByOrderId(order._id);
    return {
      ...order.toObject(),
      items,
    };
  }

  async updateOrderById(
    id: string,
    updates: OrderUpdateDTO,
    currentUser: UserDataToJWT
  ): Promise<IOrder> {
    const existingOrder = await this.repository.getById(id);
    if (!existingOrder) {
      throw new BadRequestError({
        message: `Order with the given id not found`,
        logging: true,
      });
    }
    const orderOwner = existingOrder.user.toString();
    const hasAccess = SecurityUtils.isOwnerOrAdmin(orderOwner, currentUser);
    if (!hasAccess) {
      throw new BadRequestError({
        message: "Unauthorized to update this order",
        logging: true,
        code: 403,
      });
    }
    const updatedOrder = await this.repository.updateById(
      existingOrder._id,
      updates
    );
    if (!updatedOrder) {
      throw new BadRequestError({
        message: `Failed to update order`,
        logging: true,
        code: 500,
      });
    }
    return updatedOrder;
  }

  async getOrdersByUserId(
    userId: string
  ): Promise<(IOrder & { items: IOrderItem[] })[]> {
    const orders = await this.repository.getOrdersByUserId(userId);

    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await this.orderItemService.getOrderItemsByOrderId(
          order._id.toString()
        );
        return {
          ...order.toObject(),
          items,
        };
      })
    );

    return ordersWithItems;
  }

  private async preOrder(
    data: OrderCreateFromCartDTO,
    currentUser: UserDataToJWT
  ): Promise<any> {
    // GET RELATED CART
    const cart = await this.cartService.getCartById(data.cartId);
    if (cart.items.length <= 0) {
      throw new BadRequestError({
        message: "Cart is empty, cannot create an order",
        logging: true,
      });
    }
    this.cartService.checkCartOwner(cart, currentUser);

    // UPDATE CART EXPIRATION TIME TO AVOID EXPIRATION DURING CHECKOUT
    this.cartService.setCartExpiration(cart, CartExpirationType.DEFAULT);

    // GET CART PRICING
    const { totalPriceEtx, totalPriceVat } = await this.getOrderPricing(cart);

    // VALIDATE ORDER ADDRESSES
    const { shippingAddress, billingAddress } =
      await this.validateOrderAddresses(
        data.billingAddressId,
        data.shippingAddressId,
        currentUser
      );

    const orderNumber = this.generateOrderNumber();

    return {
      cart,
      number: orderNumber,
      user: currentUser._id,
      shippingAddress: shippingAddress._id,
      billingAddress: billingAddress._id,
      status: OrderStatus.Pending,
      amountEtx: totalPriceEtx,
      amountVat: totalPriceVat,
    };
  }

  private async postOrder(
    cart: IcartResponse,
    order: IOrder,
    currentUser: UserDataToJWT
  ): Promise<IOrderItem[]> {
    // CREATE ORDER ITEMS
    const orderItems = await this.createItemsForOrder(cart, order);

    // CLEAR USER CART
    await this.cartService.clearCartForOrder(cart._id, currentUser);

    return orderItems;
  }

  private async validateOrderAddresses(
    billingAddressId: string,
    shippingAddressId: string,
    currentUser: UserDataToJWT
  ): Promise<{ shippingAddress: IAddress; billingAddress: IAddress }> {
    const [shippingAddress, billingAddress] = await Promise.all([
      await this.addressService.getAddressById(shippingAddressId, currentUser),
      await this.addressService.getAddressById(billingAddressId, currentUser),
    ]);

    if (!shippingAddress || !billingAddress) {
      throw new BadRequestError({
        message: "Invalid addresses provided",
        context: { create_order: "Invalid address provide for order" },
        logging: true,
      });
    }

    return { shippingAddress, billingAddress };
  }

  private async getOrderPricing(
    cart: IcartResponse
  ): Promise<{ totalPriceEtx: number; totalPriceVat: number }> {
    const totalPriceEtx = cart.items.reduce(
      (sum, item) => sum + item.priceEtx * item.quantity,
      0
    );
    const totalPriceVat = cart.items.reduce(
      (sum, item) => sum + item.priceVat * item.quantity,
      0
    );
    return { totalPriceEtx, totalPriceVat };
  }

  private async createItemsForOrder(
    cart: IcartResponse,
    order: IOrder
  ): Promise<IOrderItem[]> {
    const items = cart.items.map((item) => {
      const product = item.product as IProduct;
      const productVariant = item.productVariant as IProductVariant;

      const orderItem = {
        product: product._id,
        productVariant: productVariant ? productVariant._id : null,
        order: order._id,
        quantity: item.quantity,
        priceEtx: item.priceEtx,
        priceVat: item.priceVat,
        subTotalEtx: item.priceEtx * item.quantity,
        subTotalVat: item.priceVat * item.quantity,
      };
      return orderItem;
    });

    const orderItems = await this.orderItemService.createManyOrderItems(items);
    return orderItems;
  }

  private generateOrderNumber(): string {
    const orderNumber = GeneralUtils.generateUniqueIdentifier("ORD");
    return orderNumber;
  }

  async getOrdersByStatus(status: string): Promise<IOrder[]> {
    if (Object.values(OrderStatus).includes(status as OrderStatus) == false) {
      throw new BadRequestError({
        message: `Invalid order status: ${status}`,
        logging: true,
      });
    }
    const orders = await this.repository.getOrdersByStatus(
      status as OrderStatus
    );
    return orders;
  }

  async getOrderByNumber(
    orderNumber: string,
    currentUser: UserDataToJWT
  ): Promise<IOrder & { items: IOrderItem[] }> {
    const order = await this.repository.getOrderByNumber(orderNumber);

    if (!order) {
      throw new BadRequestError({
        message: `Order with the given number not found`,
        logging: true,
      });
    }
    const orderOwner = order.user.toString();
    const hasAccess = SecurityUtils.isOwnerOrAdmin(orderOwner, currentUser);
    if (!hasAccess) {
      throw new BadRequestError({
        message: "Unauthorized request",
        logging: true,
        code: 403,
      });
    }
    const items = await this.orderItemService.getOrderItemsByOrderId(order._id);
    return {
      ...order.toObject(),
      items,
    };
  }

  async getRevenueAnalytics(startDate: Date, endDate: Date): Promise<any> {
    const orders = await this.repository.getOrdersBetweenDates(startDate, endDate);
    const revenueEtx = orders.reduce((total, order) => total + order.amountEtx, 0);
    const revenueVat = orders.reduce((total, order) => total + order.amountVat, 0);
    return { revenueEtx, revenueVat };
  }

  async getSalesByCategoryAnalytics(startDate: Date, endDate: Date): Promise<any> {
    const orders = await this.repository.getOrdersBetweenDates(startDate, endDate);
    const products = await this.productRepository.getAll();
    const categories = await this.categoryRepository.getAll();

    const salesByCategory = await Promise.all(categories.map(async category => {
      const categoryProducts = products.filter(product => product.categoryIds.includes(category._id));
      const categorySales = await orders.reduce(async (totalPromise, order) => {
        const { totalEtx, totalVat } = await totalPromise;
        const orderItems = await this.orderItemService.getOrderItemsByOrderId(order._id);
        const categoryOrderItems = orderItems.filter(item => {
          const productId = typeof item.product === 'string' ? item.product : item.product._id.toString();
          return categoryProducts.some(product => {
            return product._id.toString() === productId;
          });
        });
        const orderTotalEtx = categoryOrderItems.reduce((sum, item) => sum + item.priceEtx * item.quantity, 0);
        const orderTotalVat = categoryOrderItems.reduce((sum, item) => sum + item.priceVat * item.quantity, 0);

        return {
          totalEtx: totalEtx + orderTotalEtx,
          totalVat: totalVat + orderTotalVat
        };
      }, Promise.resolve({ totalEtx: 0, totalVat: 0 }));
      return { category: category.name, totalEtx: categorySales.totalEtx, totalVat: categorySales.totalVat };
    }));
    return { salesByCategory };
  }

  async getSalesByProductAnalytics(startDate: Date, endDate: Date): Promise<any> {
    const orders = await this.repository.getOrdersBetweenDates(startDate, endDate);
    const products = await this.productRepository.getAll();
  
    const salesByProduct = await Promise.all(products.map(async product => {
      const productSales = await orders.reduce(async (totalPromise, order) => {
        const { totalEtx, totalVat } = await totalPromise;
        const orderItems = await this.orderItemService.getOrderItemsByOrderId(order._id);
        const productOrderItems = orderItems.filter(item => {
          const productId = typeof item.product === 'string' ? item.product : item.product._id.toString();
          return product._id.toString() === productId;
        });
        const orderTotalEtx = productOrderItems.reduce((sum, item) => sum + item.priceEtx * item.quantity, 0);
        const orderTotalVat = productOrderItems.reduce((sum, item) => sum + item.priceVat * item.quantity, 0);
  
        return {
          totalEtx: totalEtx + orderTotalEtx,
          totalVat: totalVat + orderTotalVat
        };
      }, Promise.resolve({ totalEtx: 0, totalVat: 0 }));
      return { product: product.name, totalEtx: productSales.totalEtx, totalVat: productSales.totalVat };
    }));
    return { salesByProduct };
  }

  async getAverageCartValue(startDate: Date, endDate: Date): Promise<any> {
    const orders = await this.repository.getOrdersBetweenDates(startDate, endDate);
    
    if (orders.length === 0) {
      return { averageEtx: 0, averageVat: 0 };
    }
  
    const totalEtx = orders.reduce((total, order) => total + order.amountEtx, 0);
    const totalVat = orders.reduce((total, order) => total + order.amountVat, 0);
  
    const averageEtx = totalEtx / orders.length;
    const averageVat = totalVat / orders.length;
  
    return { averageEtx, averageVat };
  }

  async getNewCustomersAnalytics(startDate: Date, endDate: Date): Promise<any> {
    const orders = await this.repository.getOrdersBetweenDates(startDate, endDate);

    const userIds = orders.map(order => {
      if (typeof order.user !== 'string') {
        return order.user._id.toString();
      } else {
        return order.user;
      }
    });    
  
    const users = await this.userRepository.getAll();

    const newCustomers = users.filter(user => {
      const userOrders = orders.filter(order => {
        const userIdFromOrder = typeof order.user === 'string' ? order.user : order.user._id.toString();
        return userIdFromOrder === user._id.toString();
      });

      if (userOrders.length === 0) {
        return false;
      }
  
      const firstOrder = userOrders.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())[0];

      return firstOrder && firstOrder.createdAt >= startDate && firstOrder.createdAt <= endDate;
    }).length;
  
    return { newCustomers };
  }

  async getAllOrders(): Promise<IOrder[]> {
    return await this.repository.getAllOrdersWithPopulation();
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<IOrder> {
    const validStatuses = Object.values(OrderStatus);
    if (!validStatuses.includes(status)) {
      throw new BadRequestError({
        message: `Invalid order status: ${status}`,
        logging: true,
      });
    }

    const updatedOrder = await this.repository.updateById(orderId, { status });
    if (!updatedOrder) {
      throw new BadRequestError({
        message: `Failed to update order status`,
        logging: true,
        code: 500,
      });
    }
    return updatedOrder;
  }

}
