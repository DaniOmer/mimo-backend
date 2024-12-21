import { MongooseRepository } from "../../../../librairies/repositories/mongoose/mongoose.repository";
import { IProductHasProductFeature } from "./productHasProductFeature.interface";
import { ProductHasProductFeatureModel } from "./productHasProductFeature.model";

export class ProductHasProductFeatureRepository extends MongooseRepository<IProductHasProductFeature> {
  constructor() {
    super(ProductHasProductFeatureModel);
  }
}
