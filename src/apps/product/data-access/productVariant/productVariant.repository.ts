import { MongooseRepository } from "../../../../librairies/repositories/mongoose/mongoose.repository";
import { ProductVariantModel } from "./productVariant.model";
import { IProductVariant } from "./productVariant.interface";

export class ProductVariantRepository extends MongooseRepository<IProductVariant> {
  constructor() {
    super(ProductVariantModel);
  }


  async getAllWithRelations(): Promise<IProductVariant[]> {
    return this.model
      .find()
      .populate("product_id")
      .populate("size_id")
      .populate("color_id")
      .exec();
  }

  async findByIdWithRelations(variantId: string): Promise<IProductVariant | null> {
    return this.model
      .findById(variantId)
      .populate("product_id")
      .populate("size_id")
      .populate("color_id")
      .exec();
  }


  async findByCriteria(query: any): Promise<IProductVariant[]> {
    return this.model
      .find(query)
      .populate("product_id")
      .populate("size_id")
      .populate("color_id")
      .exec();
  }

  async findLimitedEditionVariants(): Promise<IProductVariant[]> {
    return this.model
      .find({ isLimitedEdition: true })
      .populate("product_id")
      .populate("size_id")
      .populate("color_id")
      .exec();
  }
}
