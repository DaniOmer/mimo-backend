import { Types } from "mongoose";
import BadRequestError from "../../../../config/error/bad.request.config";
import { BaseService } from "../../../../librairies/services";
import {
  IOrder,
  OrderModel,
  OrderRepository,
  OrderStatus,
} from "../data-access";
import { OrderCreateFromCartDTO } from "./order.dto";
import { UserDataToJWT } from "../../../../utils/security.utils";
import { CartService, IcartResponse } from "../../cart/domain";
import { IAddress } from "../../../address/data-access";
import { AddressService } from "../../../address/domain";
import { ProductService } from "../../../product/domain";
import { ProductVariantService } from "../../../product/domain";
import { InventoryService } from "../../../product/domain/inventory/inventory.service";
import { IProduct, IProductVariant } from "../../../product/data-access";

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

  async createOrder(order: IOrder): Promise<IOrder> {
    const createdOrder = await this.repository.create(order);
    return createdOrder;
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
    await this.postOrder(data, user, cart);
    return createdOrder;
  }

  async getOrderById(id: string): Promise<IOrder> {
    const order = await this.repository.getById(id);
    if (!order) {
      throw new BadRequestError({
        message: `Order with ID ${id} not found`,
        context: { orderId: id },
        logging: true,
      });
    }
    return order;
  }

  async updateOrderById(
    id: string,
    updates: Omit<IOrder, "_id" | "orderDate" | "user">
  ): Promise<IOrder> {
    const updatedOrder = await this.repository.updateById(id, updates);
    if (!updatedOrder) {
      throw new BadRequestError({
        message: `Order with ID ${id} not found or failed to update`,
        context: { orderId: id, updates },
        logging: true,
      });
    }
    return updatedOrder;
  }

  async deleteOrderById(id: string): Promise<IOrder> {
    const deletedOrder = await this.repository.deleteById(id);
    if (!deletedOrder) {
      throw new BadRequestError({
        message: `Order with ID ${id} not found for deletion`,
        context: { orderId: id },
        logging: true,
      });
    }
    return deletedOrder;
  }

  async getOrdersByUserId(userId: string): Promise<IOrder[]> {
    try {
      const userObjectId = new Types.ObjectId(userId);

      const orders = await OrderModel.find({ userId: userObjectId }).exec();

      return orders;
    } catch (error) {
      throw new Error("Error fetching orders for user");
    }
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

    // RESERVE STOCK
    await this.reserveStockForOrder(cart, cart.user.toString());

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

  async postOrder(
    data: OrderCreateFromCartDTO,
    currentUser: UserDataToJWT,
    cart: IcartResponse
  ): Promise<any> {
    // CLEAR USER CART
    await this.cartService.clearCart(currentUser, data.cartId);

    // RELEASE RESERVED STOCK AND UPDATE INVENTORY QUANTITY
    await this.releaseStockForOrder(cart, currentUser._id);
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

  private async reserveStockForOrder(
    cart: IcartResponse,
    userId: string
  ): Promise<any> {
    for (const item of cart.items) {
      // GET INVENTORY WITH PRODUCT AND PRODUCT VARIANT DETAILS FOR ORDER ITEM
      const inventory =
        await this.inventoryService.getInventoryByProductAndVariantId(
          item.product.toString(),
          item.productVariant.toString()
        );
      // VALID ORDER ITEM INVENTORY
      this.inventoryService.validateInventoryStock(inventory, item.quantity);
      // RESERVE STOCK FOR ORDER ITEM
      await this.inventoryService.reserveStock(
        inventory,
        item.quantity,
        userId
      );
    }
  }

  private async releaseStockForOrder(
    cart: IcartResponse,
    userId: string
  ): Promise<any> {
    for (const item of cart.items) {
      // GET INVENTORY WITH PRODUCT AND PRODUCT VARIANT DETAILS FOR ORDER ITEM
      const inventory =
        await this.inventoryService.getInventoryByProductAndVariantId(
          item.product.toString(),
          item.productVariant.toString()
        );
      // RELEASE RESERVED STOCK AND UPDATE INVENTORY QUANTITY
      await this.inventoryService.releaseStock(inventory._id, userId);
    }
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
