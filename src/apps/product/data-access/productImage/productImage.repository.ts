import { MongooseRepository } from "../../../../librairies/repositories/mongoose/mongoose.repository";
import { IProductImage } from "./productImage.interface";
import { ProductImageModel } from "./productImage.model";

export class ProductImageRepository extends MongooseRepository<IProductImage> {
  constructor() {
    super(ProductImageModel);
  }

  async findByProductId(productId: string): Promise<IProductImage[]> {
    return this.model.find({ productId }).exec();
  }


  async findByIds(imageIds: string[]): Promise<IProductImage[]> {
    return this.model.find({ _id: { $in: imageIds } }).exec();
  }

}
