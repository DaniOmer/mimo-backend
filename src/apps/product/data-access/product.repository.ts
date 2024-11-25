import { IProduct } from "./product.interface";
import { ProductModel } from "./product.model";
import { MongooseRepository } from "../../../librairies/repositories/mongoose/mongoose.repository";

export class ProductRepository extends MongooseRepository<IProduct> {
  constructor() {
    super(ProductModel); 
  }

}
