import { ProductRepository } from "../data-access/product.repository";
import { IProduct } from "../data-access/product.interface";

export class ProductService {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  async createProduct(data: Partial<IProduct>): Promise<IProduct> {
    return this.productRepository.create(data);
  }

  async listProducts(): Promise<IProduct[]> {
    return this.productRepository.findAll();
  }

  async getProductById(productId: string): Promise<IProduct | null> {
    return this.productRepository.findById(productId);
  }

  async updateProduct(productId: string, updates: Partial<IProduct>): Promise<IProduct | null> {
    return this.productRepository.update(productId, updates);
  }

  async deleteProduct(productId: string): Promise<void> {
    await this.productRepository.delete(productId);
  }
}
