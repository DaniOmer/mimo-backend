import { IProduct } from "./product.interface";
import { ProductModel } from "./product.model";
import { MongooseRepository } from "../../../librairies/repositories/mongoose/mongoose.repository";

export class ProductRepository extends MongooseRepository<IProduct> {
  constructor() {
    super(ProductModel); 
  }

  async findByIdWithRelations(productId: string): Promise<IProduct | null> {
    return this.model
      .findById(productId)
      .populate("images")
      .populate("categoryIds")
      .populate("featureIds")
      .exec();
  }

}
