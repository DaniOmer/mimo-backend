import { MongooseRepository } from "../../../../librairies/repositories/mongoose/mongoose.repository";
import { ProductFeatureModel } from "./productFeature.model";
import { IProductFeature } from "./productFeature.interface";

export class ProductFeatureRepository extends MongooseRepository<IProductFeature> {
  constructor() {
    super(ProductFeatureModel);
  }

  async findByIds(featureIds: string[]): Promise<IProductFeature[]> {
    return this.model.find({ _id: { $in: featureIds } }).exec();
  }
}
