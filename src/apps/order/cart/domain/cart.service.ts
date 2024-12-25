import { ObjectId } from "mongoose";
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

  async getCartById(id: ObjectId): Promise<ICart & { items: ICartItem[] }> {
    const existingCart = await this.repository.getById(id.toString());
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

  async getCartByUser(user: ObjectId): Promise<ICart & { items: ICartItem[] }> {
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

  async addItemToCart(data: CartItemDTO, user: ObjectId): Promise<void> {
    const cart = await this.getCartByUser(user);
    if (!cart) {
      throw new BadRequestError({
        message: "Failed to find cart for current user",
        logging: true,
      });
    }
    const existingItem = await this.cartItemService.getCartItem(
      cart._id,
      data.productId,
      data.productVariantId
    );

    if (existingItem) {
      await this.cartItemService.incrementCartItemQuantity(
        existingItem,
        data.quantity
      );
      return;
    }

    const { product, productVariant } =
      await this.inventoryService.validateProductAndVariant(
        data.productId.toString(),
        data.productVariantId ? data.productVariantId.toString() : null
      );

    await this.inventoryService.validateInventoryStock(
      product,
      productVariant,
      data.quantity
    );

    await this.cartItemService.createCartItem(
      cart._id,
      product,
      productVariant,
      data.quantity
    );
  }

  async updateCartItemQuantity(
    currentUser: UserDataToJWT,
    cartId: ObjectId,
    productId: ObjectId,
    productVariantId: ObjectId | null,
    newQuantity: number
  ): Promise<void> {
    const existingCartItem = await this.cartItemService.getCartItem(
      cartId,
      productId,
      productVariantId
    );
    if (!existingCartItem) {
      throw new BadRequestError({
        message: `Cart item for product with ID ${productId} not found`,
        context: { update_cart_item: "Item not found" },
        logging: true,
      });
    }

    const cart = existingCartItem.cart as ICart;
    const itemOwner = cart.user.toString();
    const hasAccess = SecurityUtils.isOwnerOrAdmin(itemOwner, currentUser);
    if (!hasAccess) {
      throw new BadRequestError({
        message: "Unauthorized to update this cart item",
        logging: true,
        code: 403,
      });
    }

    const { product, productVariant } =
      await this.inventoryService.validateProductAndVariant(
        productId.toString(),
        productVariantId ? productVariantId.toString() : null
      );

    await this.inventoryService.validateInventoryStock(
      product,
      productVariant,
      newQuantity
    );

    await this.cartItemService.updateItemQuantity(
      existingCartItem,
      newQuantity
    );
  }

  async clearCart(currentUser: UserDataToJWT, cartId: string): Promise<void> {
    const cart = await this.repository.getById(cartId);
    if (!cart) {
      throw new BadRequestError({
        message: "Failed to find cart to clear",
        logging: true,
      });
    }
    const cartOwner = cart.user.toString();
    const hasAccess = SecurityUtils.isOwnerOrAdmin(cartOwner, currentUser);
    if (!hasAccess) {
      throw new BadRequestError({
        message: "Unauthorized to clear this cart",
        logging: true,
        code: 403,
      });
    }
    const deletedCount = await this.cartItemService.deleteAllItemsForCart(cart);
    if (deletedCount === 0) {
      throw new BadRequestError({
        message: "Cart is empty. Nothing to clear",
        logging: true,
      });
    }
  }
}
