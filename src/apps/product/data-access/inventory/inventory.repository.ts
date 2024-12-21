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
  ): Promise<IIventory[]> {
    return this.model.find({ product, productVariant }).exec();
  }
}
