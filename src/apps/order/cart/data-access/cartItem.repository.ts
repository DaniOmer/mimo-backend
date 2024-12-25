import { ObjectId } from "mongoose";
import { ICartItem } from "./cartItem.interface";
import { CartItemModel } from "./cartItem.model";
import { MongooseRepository } from "../../../../librairies/repositories/mongoose/mongoose.repository";

export class CartItemRepository extends MongooseRepository<ICartItem> {
  constructor() {
    super(CartItemModel);
  }

  async getCartItem(
    cart: ObjectId,
    product: ObjectId,
    productVariant: ObjectId | null
  ): Promise<ICartItem | null> {
    return await this.model
      .findOne({ cart, product, productVariant })
      .populate("cart")
      .populate("product")
      .populate("productVariant")
      .exec();
  }

  async updateItem(item: ICartItem): Promise<ICartItem | null> {
    return await item.save();
  }

  async deleteManyItemsByCart(
    cart: ObjectId
  ): Promise<{ deletedCount: number }> {
    return await this.model.deleteMany({ cart });
  }
}
