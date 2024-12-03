import { MongooseRepository } from "../../../../librairies/repositories/mongoose/mongoose.repository";
import { IProductHasCategory } from "./productHasCategory.interface";
import { ProductHasCategoryModel } from "./productHasCategory.model";

export class ProductHasCategoryRepository extends MongooseRepository<IProductHasCategory> {
  constructor() {
    super(ProductHasCategoryModel);
  }
}
