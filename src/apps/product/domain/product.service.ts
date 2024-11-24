import { BaseService } from "../../../librairies/services/";
import { ProductRepository } from "../data-access/product.repository";
import { IProduct } from "../data-access/product.interface";

export class ProductService extends BaseService<IProduct> {
  constructor() {
    super(new ProductRepository(), "Product");
  }

}