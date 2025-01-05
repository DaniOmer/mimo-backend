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
import { IProduct, IProductVariant } from "../../../product/data-access";

export class OrderService extends BaseService {
  readonly repository: OrderRepository;
  readonly cartService: CartService;
  readonly addressService: AddressService;
  readonly productService: ProductService;
  readonly productVariantService: ProductVariantService;
  readonly inventoryService: InventoryService;
  readonly orderItemService: OrderItemService;

  constructor() {
    super("Order");
    this.repository = new OrderRepository();
    this.cartService = new CartService();
    this.addressService = new AddressService();
    this.productService = new ProductService();
    this.productVariantService = new ProductVariantService();
    this.inventoryService = new InventoryService();
    this.orderItemService = new OrderItemService();
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
}
