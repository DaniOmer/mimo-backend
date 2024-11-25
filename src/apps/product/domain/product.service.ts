import { ProductRepository } from "../data-access/product.repository";
import { IProduct } from "../data-access/product.interface";
import { BaseService } from "../../../librairies/services/base.service";

export class ProductService extends BaseService<IProduct> {
  private repository: ProductRepository;

  constructor() {
    super("Product");
    this.repository = new ProductRepository();
  }

  async createProduct(data: Partial<IProduct>): Promise<IProduct> {
    return this.repository.create(data);
  }

  async getProductById(id: string): Promise<IProduct> {
    const product = await this.repository.getById(id);
    return this.validateDataExists(product, id);
  }

  async getAllProducts(): Promise<IProduct[]> {
    return this.repository.getAll();
  }

  async updateProductById(id: string, updates: Partial<IProduct>): Promise<IProduct> {
    const updatedProduct = await this.repository.updateById(id, updates);
    return this.validateDataExists(updatedProduct, id);
  }

  async deleteProductById(id: string): Promise<IProduct> {
    const deletedProduct = await this.repository.deleteById(id);
    return this.validateDataExists(deletedProduct, id);
  }
}
