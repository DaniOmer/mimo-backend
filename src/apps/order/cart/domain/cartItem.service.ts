import { BaseService } from "../../../../librairies/services";
import { ICartItem, ICart } from "../data-access";
import { CartItemRepository } from "../data-access/cartItem.repository";
import BadRequestError from "../../../../config/error/bad.request.config";
import { IProduct, IProductVariant } from "../../../product/data-access";

export class CartItemService extends BaseService {
  private repository: CartItemRepository;
  constructor() {
    super("CartItem");
    this.repository = new CartItemRepository();
  }

  async getCartItemById(cartId: string): Promise<ICartItem | null> {
    const cartItem = await this.repository.getCartItemById(cartId);

    if (!cartItem) return null;
    return cartItem;
  }

  async getByCartProductAndVariant(
    cartId: string,
    productId: string,
    productVariantId: string | null
  ): Promise<ICartItem | null> {
    const cartItem = await this.repository.getCartItem(
      cartId,
      productId,
      productVariantId
    );
    if (!cartItem) {
      return null;
    }
    return cartItem;
  }

  async getItemsByCart(cartId: string): Promise<ICartItem[]> {
    const cartItems = await this.repository.getCartItemsByCart(cartId);
    if (!cartItems) {
      return [];
    }
    return cartItems;
  }

  async createCartItem(
    cartId: string,
    product: IProduct,
    productVariant: IProductVariant | null,
    quantity: number
  ): Promise<ICartItem> {
    const priceEtx = product.hasVariants
      ? productVariant?.priceEtx
      : product.priceEtx;
    const priceVat = product.hasVariants
      ? productVariant?.priceVat
      : product.priceVat;

    if (!priceEtx || !priceVat) {
      throw new BadRequestError({
        message: "Product price not available",
        logging: true,
      });
    }

    const cartItem = await this.repository.create({
      product: product._id,
      productVariant: productVariant?._id || undefined,
      cart: cartId,
      priceEtx,
      priceVat,
      quantity,
      subTotalEtx: priceEtx * quantity,
      subTotalVat: priceVat * quantity,
    });
    if (!cartItem) {
      throw new BadRequestError({
        message: "Failed to create cart item",
        logging: true,
      });
    }
    return cartItem;
  }

  async incrementCartItemQuantity(
    item: ICartItem,
    quantity: number
  ): Promise<void> {
    const updatedQuantity = item.quantity + quantity;

    item.quantity = updatedQuantity;
    item.subTotalEtx = item.priceEtx * updatedQuantity;
    item.subTotalVat = item.priceVat * updatedQuantity;
    await this.repository.updateById(item._id.toString(), item);
  }

  async updateItemQuantity(item: ICartItem, quantity: number): Promise<void> {
    if (quantity <= 0) {
      await this.deleteCartItem(item._id.toString());
      return;
    }
    item.quantity = quantity;
    item.subTotalEtx = item.priceEtx * quantity;
    item.subTotalVat = item.priceVat * quantity;
    const updatedItem = await this.repository.updateById(
      item._id.toString(),
      item
    );
    if (!updatedItem) {
      throw new BadRequestError({
        message: "Failed to update cart item",
        logging: true,
        code: 500,
      });
    }
  }

  async deleteCartItem(id: string): Promise<void> {
    const deletedItem = await this.repository.deleteById(id);
    if (!deletedItem) {
      throw new BadRequestError({
        message: "Failed to delete cart item",
        logging: true,
        code: 500,
      });
    }
  }

  async deleteAllItemsForCart(cart: ICart): Promise<number> {
    const { deletedCount } = await this.repository.deleteManyItemsByCart(
      cart.id
    );
    if (!deletedCount) {
      throw new BadRequestError({
        message: "Failed to delete all cart items",
        logging: true,
        code: 500,
      });
    }
    return deletedCount;
  }
}
