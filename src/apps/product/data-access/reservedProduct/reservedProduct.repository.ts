import { MongooseRepository } from "../../../../librairies/repositories";
import { IReservedProduct } from "./reservedProduct.interface";
import { ReservedProductModel } from "./reservedProduct.model";

export class ReservedProductRepository extends MongooseRepository<IReservedProduct> {
  constructor() {
    super(ReservedProductModel);
  }

  async getAllByInventoryId(id: string): Promise<IReservedProduct[] | null> {
    return this.model.find({ inventoryId: id }).exec();
  }

  async getByInventoryAndUserId(
    inventoryId: string,
    userId: string
  ): Promise<IReservedProduct | null> {
    return this.model
      .findOne({ inventoryId: inventoryId, reservedById: userId })
      .exec();
  }
}
