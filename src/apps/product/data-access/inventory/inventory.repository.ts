import { InventoryModel } from "./inventory.model";
import { IIventory } from "./inventory.interface";
import { MongooseRepository } from "../../../../librairies/repositories";

export class InventoryRepository extends MongooseRepository<IIventory> {
  constructor() {
    super(InventoryModel);
  }

  async getInventoryByProductAndVariantId(
    productId: string,
    productVariantId: string | undefined
  ): Promise<IIventory[]> {
    return this.model.find({ productId, productVariantId }).exec();
  }
}
