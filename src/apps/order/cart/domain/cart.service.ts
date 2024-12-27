import { AppConfig } from "../../../../config/app.config";
import { BaseService } from "../../../../librairies/services";
import { ICart } from "../data-access/cart.interface";
import { CartRepository, ICartItem } from "../data-access";
import { CartItemDTO } from "./cart.dto";
import { CartItemService } from "./cartItem.service";
import { ProductService } from "../../../product/domain";
import { ProductVariantService } from "../../../product/domain";
import BadRequestError from "../../../../config/error/bad.request.config";
import { InventoryService } from "../../../product/domain/inventory/inventory.service";
import { SecurityUtils, UserDataToJWT } from "../../../../utils/security.utils";
import { IProduct, IProductVariant } from "../../../product/data-access";

export type IcartResponse = ICart & { items: ICartItem[] };

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

  async getCartById(id: string): Promise<ICart & { items: ICartItem[] }> {
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
    data: CartItemDTO,
    currentUser: UserDataToJWT
  ): Promise<ICart & { items: ICartItem[] }> {
    const existingCart = await this.getCartByUser(currentUser._id);
    if (!existingCart) {
      throw new BadRequestError({
        message: "Failed to find cart for current user",
        logging: true,
      });
    }
    let cartItem = await this.cartItemService.getCartItem(
      existingCart._id,
      data.productId,
      data.productVariantId
    );

    if (!cartItem) {
      const { product, productVariant } =
        await this.inventoryService.validateProductAndVariant(
          data.productId.toString(),
          data.productVariantId ? data.productVariantId.toString() : null
        );
      const defaultQuantity = 0;

      cartItem = await this.cartItemService.createCartItem(
        existingCart._id,
        product,
        productVariant,
        defaultQuantity
      );
    }
    await this.reserveStockForCart(data.quantity, cartItem, currentUser);
    await this.cartItemService.incrementCartItemQuantity(
      cartItem,
      data.quantity
    );
    // LOGIC HERE TO DEFINE CART EXPIRATION TIME
    return await this.setCartExpiration(existingCart);
  }

  async updateCartItemQuantity(
    currentUser: UserDataToJWT,
    cartId: string,
    productId: string,
    productVariantId: string | null,
    newQuantity: number
  ): Promise<ICart & { items: ICartItem[] }> {
    const existingCartItem = await this.cartItemService.getCartItem(
      cartId,
      productId,
      productVariantId
    );
    if (!existingCartItem) {
      throw new BadRequestError({
        message: "Failed to find cart item with given id",
        logging: true,
      });
    }

    const cart = existingCartItem.cart as ICart;
    this.checkCartOwner(cart, currentUser);

    const { product, productVariant } =
      await this.inventoryService.validateProductAndVariant(
        productId.toString(),
        productVariantId ? productVariantId.toString() : null
      );
    // FIRST RELEASE RESERVERD STOCK RELATED TO OLD QUANTITY BEFORE NEW RESERVE
    // await this.releaseStockForCart(
    //   existingCartItem.quantity,
    //   existingCartItem,
    //   currentUser
    // );

    // THEN RESERVE STOCK RELATED TO NEW QUANTITY AFTER UPDATION
    await this.reserveStockForCart(newQuantity, existingCartItem, currentUser);
    await this.cartItemService.updateItemQuantity(
      existingCartItem,
      newQuantity
    );

    // LOGIC HERE TO UPDATE CART EXPIRATION TIME
    return await this.setCartExpiration(cart);
  }

  async clearCart(currentUser: UserDataToJWT, cartId: string): Promise<void> {
    const cart = await this.repository.getById(cartId);
    if (!cart) {
      throw new BadRequestError({
        message: "Failed to find cart to clear",
        logging: true,
      });
    }
    this.checkCartOwner(cart, currentUser);

    // ADD LOGIC HERE TO RELEASE RESERVED INVENTORY BEFORE CLEAR CART
    // await this.releaseStockForCart(
    //   cart.items.reduce((sum, item) => sum + item.quantity, 0),
    //   cart,
    //   currentUser
    // );

    await this.cartItemService.deleteAllItemsForCart(cart);
    const deletedCount = await this.cartItemService.deleteAllItemsForCart(cart);
    if (deletedCount === 0) {
      throw new BadRequestError({
        message: "Cart is empty. Nothing to clear",
        logging: true,
      });
    }
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
    item: ICartItem,
    currentUser: UserDataToJWT
  ): Promise<void> {
    const product = item.product as IProduct;
    const variant = item.productVariant as IProductVariant | null;
    const inventory =
      await this.inventoryService.getInventoryByProductAndVariantId(
        product._id,
        variant ? variant._id : null
      );

    await this.inventoryService.validateInventoryStock(inventory, quantity);
    await this.inventoryService.reserveStock(
      inventory,
      quantity,
      currentUser._id
    );
  }

  private async setCartExpiration(
    cart: ICart
  ): Promise<ICart & { items: ICartItem[] }> {
    const expirationTime = this.getReservationDuration();
    cart.expireAt = new Date(Date.now() + expirationTime);
    const updatedCart = await this.updateCart(cart.id, {
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
}
