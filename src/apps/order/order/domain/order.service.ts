import BadRequestError from "../../../../config/error/bad.request.config";
import { BaseService } from "../../../../librairies/services";
import { IOrder, OrderRepository, OrderStatus } from "../data-access";
import { OrderCreateFromCartDTO, OrderUpdateDTO } from "./order.dto";
import { SecurityUtils, UserDataToJWT } from "../../../../utils/security.utils";
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

export class OrderService extends BaseService {
  readonly repository: OrderRepository;
  readonly cartService: CartService;
  readonly addressService: AddressService;
  readonly productService: ProductService;
  readonly productVariantService: ProductVariantService;
  readonly inventoryService: InventoryService;

  constructor() {
    super("Order");
    this.repository = new OrderRepository();
    this.cartService = new CartService();
    this.addressService = new AddressService();
    this.productService = new ProductService();
    this.productVariantService = new ProductVariantService();
    this.inventoryService = new InventoryService();
  }

  async createOrderFromCart(
    data: OrderCreateFromCartDTO,
    user: UserDataToJWT
  ): Promise<IOrder> {
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
    await this.postOrder(data, user);
    return createdOrder;
  }

  async getOrderById(id: string, currentUser: UserDataToJWT): Promise<IOrder> {
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
    return order;
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

  async getOrdersByUserId(userId: string): Promise<IOrder[]> {
    const allOrders = this.repository.getOrdersByUserId(userId);
    return allOrders;
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
        data.shippingAddressId
      );

    const orderNumber = "ORD-9829833-fhH483"; // TO IMPLEMENT LATER

    return {
      cart,
      number: orderNumber,
      user: currentUser._id,
      shippingAddress: shippingAddress._id,
      billingAddress: billingAddress._id,
      status: OrderStatus.Pending,
      priceEtx: totalPriceEtx,
      priceVat: totalPriceVat,
    };
  }

  private async postOrder(
    data: OrderCreateFromCartDTO,
    currentUser: UserDataToJWT
  ): Promise<any> {
    await this.cartService.clearCartForOrder(data.cartId, currentUser);
  }

  private async validateOrderAddresses(
    billingAddressId: string,
    shippingAddressId: string
  ): Promise<{ shippingAddress: IAddress; billingAddress: IAddress }> {
    const [shippingAddress, billingAddress] = await Promise.all([
      await this.addressService.getAddressById(shippingAddressId),
      await this.addressService.getAddressById(billingAddressId),
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
}
