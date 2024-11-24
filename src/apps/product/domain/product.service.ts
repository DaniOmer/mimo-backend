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

  async getAllProducts(): Promise<IProduct[]> {
    return this.productRepository.getAll(); 
  }

  async getProductById(productId: string): Promise<IProduct | null> {
    const product = await this.productRepository.getById(productId); 
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  }

  async updateProduct(productId: string, updates: Partial<IProduct>): Promise<IProduct | null> {
    const product = await this.productRepository.updateById(productId, updates); 
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  }

  async deleteProduct(productId: string): Promise<void> {
    await this.productRepository.deleteById(productId); 
  }
}
