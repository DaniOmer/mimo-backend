import { AppConfig } from "../../../../config/app.config";
import { BaseService } from "../../../../librairies/services";
import { ICart } from "../data-access/cart.interface";
import { CartRepository, ICartItem } from "../data-access";
import { CartItemCreateDTO, CartItemUpdateDTO } from "./cart.dto";
import { CartItemService } from "./cartItem.service";
import { ProductService } from "../../../product/domain";
import { ProductVariantService } from "../../../product/domain";
import BadRequestError from "../../../../config/error/bad.request.config";
import {
  InventoryService,
  ReleaseType,
} from "../../../product/domain/inventory/inventory.service";
import { SecurityUtils, UserDataToJWT } from "../../../../utils/security.utils";
import { IProduct, IProductVariant } from "../../../product/data-access";

export type IcartResponse = ICart & { items: ICartItem[] };
export enum CartExpirationType {
  DEFAULT = "default",
  IMMEDIATE = "immediate",
}

export class CartService extends BaseService {
  readonly repository: CartRepository;
  readonly cartItemService: CartItemService;
  readonly productService: ProductService;
  readonly productVariantService: ProductVariantService;
  readonly inventoryService: InventoryService;

  constructor() {
    super("Cart");
    this.repository = new CartRepository();
    this.productService = new ProductService();
    this.productVariantService = new ProductVariantService();
    this.cartItemService = new CartItemService();
    this.inventoryService = new InventoryService();
  }

  async getCartById(id: string): Promise<IcartResponse> {
    const existingCart = await this.repository.getById(id);
    if (!existingCart) {
      throw new BadRequestError({
        message: "Failed to find cart with given id",
        logging: true,
      });
    }
    const items = await this.cartItemService.getItemsByCart(existingCart._id);
    return {
      ...existingCart.toObject(),
      items,
    };
  }

  async getCartByUser(user: string): Promise<IcartResponse> {
    let existingCart = await this.repository.getCartByUserId(user.toString());
    if (!existingCart) {
      existingCart = await this.repository.create({ user });
    }
    const items = await this.cartItemService.getItemsByCart(existingCart._id);
    return {
      ...existingCart.toObject(),
      items,
    };
  }

  private async updateCart(id: string, data: Partial<ICart>): Promise<ICart> {
    const updatedCart = await this.repository.updateById(id, data);
    if (!updatedCart) {
      throw new BadRequestError({
        message: "Failed to find and update cart with given id",
        logging: true,
      });
    }
    return updatedCart;
  }

  async addItemToCart(
    data: CartItemCreateDTO,
    currentUser: UserDataToJWT
  ): Promise<IcartResponse> {
    const existingCart = await this.getCartByUser(currentUser._id);
    const existingCartItem =
      await this.cartItemService.getByCartProductAndVariant(
        existingCart._id,
        data.productId,
        data.productVariantId || null
      );

    if (existingCartItem) {
      throw new BadRequestError({
        message: "Cart item already exists for current user",
        logging: true,
      });
    }
    const { product, productVariant } =
      await this.inventoryService.validateProductAndVariant(
        data.productId.toString(),
        data.productVariantId ? data.productVariantId.toString() : null
      );
    const defaultQuantity = 0;

    await this.reserveStockForCart(
      data.quantity,
      { product, productVariant },
      currentUser
    );
    const createdCartItem = await this.cartItemService.createCartItem(
      existingCart._id,
      product,
      productVariant,
      defaultQuantity
    );
    await this.cartItemService.incrementCartItemQuantity(
      createdCartItem,
      data.quantity
    );
    // LOGIC HERE TO DEFINE CART EXPIRATION TIME
    return await this.setCartExpiration(
      existingCart,
      CartExpirationType.DEFAULT
    );
  }

  async updateCartItemQuantity(
    cartItemId: string,
    data: CartItemUpdateDTO,
    currentUser: UserDataToJWT
  ): Promise<ICart & { items: ICartItem[] }> {
    const existingCartItem = await this.cartItemService.getCartItemById(
      cartItemId
    );
    if (!existingCartItem) {
      throw new BadRequestError({
        message: "Failed to find cart item with given id",
        logging: true,
      });
    }

    const cart = existingCartItem.cart as ICart;
    const existingProduct = existingCartItem.product as IProduct;
    const existingProductVariant =
      existingCartItem.productVariant as IProductVariant | null;

    this.checkCartOwner(cart, currentUser);

    await this.inventoryService.validateProductAndVariant(
      existingProduct._id.toString(),
      existingProductVariant ? existingProductVariant._id.toString() : null
    );

    // RESERVE STOCK RELATED TO NEW QUANTITY AFTER UPDATE
    await this.reserveStockForCart(
      data.quantity,
      { product: existingProduct, productVariant: existingProductVariant },
      currentUser
    );
    await this.cartItemService.updateItemQuantity(
      existingCartItem,
      data.quantity
    );

    // LOGIC HERE TO UPDATE CART EXPIRATION TIME
    return await this.setCartExpiration(cart, CartExpirationType.DEFAULT);
  }

  async clearCart(
    cartId: string,
    type: ReleaseType,
    currentUser: UserDataToJWT
  ): Promise<void> {
    const cart = await this.repository.getById(cartId);
    if (!cart) {
      throw new BadRequestError({
        message: "Failed to find cart to clear",
        logging: true,
      });
    }
    this.checkCartOwner(cart, currentUser);
    await this.releaseStockForCart(cart, currentUser, type);
    const deletedCount = await this.cartItemService.deleteAllItemsForCart(cart);

    if (deletedCount === 0) {
      throw new BadRequestError({
        message: "Cart is empty. Nothing to clear",
        logging: true,
      });
    }
    await this.setCartExpiration(cart, CartExpirationType.IMMEDIATE);
  }

  async clearCartForCancel(
    cartId: string,
    currentUser: UserDataToJWT
  ): Promise<void> {
    await this.clearCart(cartId, ReleaseType.CANCEL, currentUser);
  }

  async clearCartForOrder(
    cartId: string,
    currentUser: UserDataToJWT
  ): Promise<void> {
    await this.clearCart(cartId, ReleaseType.FINALIZED, currentUser);
  }

  checkCartOwner(cart: ICart, currentUser: UserDataToJWT): void {
    const itemOwner = cart.user.toString();
    const hasAccess = SecurityUtils.isOwnerOrAdmin(itemOwner, currentUser);
    if (!hasAccess) {
      throw new BadRequestError({
        message: "Unauthorized to update this cart item",
        logging: true,
        code: 403,
      });
    }
  }

  async reserveStockForCart(
    quantity: number,
    data: { product: IProduct; productVariant: IProductVariant | null },
    currentUser: UserDataToJWT
  ): Promise<void> {
    const product = data.product as IProduct;
    const variant = data.productVariant as IProductVariant | null;
    const inventory =
      await this.inventoryService.getInventoryByProductAndVariantId(
        product._id,
        variant ? variant._id : null
      );

    await this.inventoryService.reserveStock(
      inventory,
      quantity,
      currentUser._id
    );
  }

  async releaseStockForCart(
    cart: ICart,
    currentUser: UserDataToJWT,
    type: ReleaseType
  ): Promise<void> {
    const items = await this.cartItemService.getItemsByCart(cart._id);
    for (const item of items) {
      const product = item.product as IProduct;
      const variant = item.productVariant as IProductVariant | null;
      const inventory =
        await this.inventoryService.getInventoryByProductAndVariantId(
          product._id,
          variant ? variant._id : null
        );

      await this.inventoryService.releaseStock(
        inventory,
        currentUser._id,
        type
      );
    }
  }

  async setCartExpiration(
    cart: ICart,
    type: CartExpirationType
  ): Promise<ICart & { items: ICartItem[] }> {
    let expirationTime: Date;

    if (type === CartExpirationType.DEFAULT) {
      const reservationDuration = this.getReservationDuration();
      expirationTime = new Date(Date.now() + reservationDuration);
    } else if (type === CartExpirationType.IMMEDIATE) {
      expirationTime = new Date();
    } else {
      throw new BadRequestError({
        message: "Invalid cart expiration type provided",
        code: 400,
      });
    }

    cart.expireAt = expirationTime;
    const updatedCart = await this.updateCart(cart._id, {
      expireAt: cart.expireAt,
    });
    const items = await this.cartItemService.getItemsByCart(updatedCart._id);
    return {
      ...updatedCart.toObject(),
      items,
    };
  }

  private getReservationDuration(): number {
    const expirationTime = parseInt(AppConfig.cart.expirationTime, 10);
    if (isNaN(expirationTime) || expirationTime <= 0) {
      throw new BadRequestError({
        message: "Invalid cart expiration time",
        code: 400,
      });
    }

    return expirationTime * 1000;
  }

  async removeItemFromCart(
    cartItemId: string,
    currentUser: UserDataToJWT
  ): Promise<void> {
    const cartItem = await this.cartItemService.getCartItemById(cartItemId);
    if (!cartItem) {
      throw new BadRequestError({
        message: "Failed to find cart item with given id",
        logging: true,
      });
    }
    const cart = cartItem.cart as ICart;
    this.checkCartOwner(cart, currentUser);
    await this.cartItemService.deleteCartItem(cartItemId);
    await this.setCartExpiration(cart, CartExpirationType.DEFAULT);
  }
}
