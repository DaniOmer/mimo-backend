import { InventoryModel } from "./inventory.model";
import { IIventory } from "./inventory.interface";
import { MongooseRepository } from "../../../../librairies/repositories";

export class InventoryRepository extends MongooseRepository<IIventory> {
  constructor() {
    super(InventoryModel);
  }

  async getInventoryByProductAndVariantId(
    product: string,
    productVariant: string | undefined
  ): Promise<IIventory | null> {
    return this.model.findOne({ product, productVariant }).exec();
  }

  async getLowQuantityProducts(thershold: number): Promise<IIventory[]> {
    return this.model
      .find({ quantity: { $lt: thershold } })
      .populate("product")
      .populate("productVariant")
      .exec();
  }

  async getInventoriesWithProductAndVariant(): Promise<IIventory[]> {
    return this.model
      .find()
      .populate("product")
      .populate("productVariant")
      .exec();
  }
}
