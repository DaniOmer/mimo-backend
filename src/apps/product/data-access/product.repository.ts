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

  async findAllWithRelations(): Promise<IProduct[]> {
    return this.model
      .find()
      .populate("images")
      .populate("categoryIds")
      .populate("featureIds")
      .exec();
  }

  async findByCriteria(query: any): Promise<IProduct[]> {
    return this.model
      .find(query)
      .populate("categoryIds")
      .populate("featureIds")
      .populate("images")
      .exec();
  }

  async findByStatus(isActive: boolean): Promise<IProduct[]> {
    return this.model.find({ isActive }).exec();
  }
}
