import { ProductRepository } from "../data-access/product.repository";
import { IProduct } from "../data-access/product.interface";
import BadRequestError from "../../../config/error/bad.request.config";
import { isValidObjectId } from "mongoose";

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
    return this.validateAndFetchProduct(productId, "getProductById");
  }

  async updateProduct(productId: string, updates: Partial<IProduct>): Promise<IProduct | null> {
    await this.validateObjectId(productId, "updateProduct");

    const product = await this.productRepository.updateById(productId, updates);
    if (!product) {
      throw new BadRequestError({
        message: "Product not found",
        code: 404,
        context: {
          productId,
          operation: "updateProduct",
          timestamp: new Date().toISOString(),
        },
      });
    }
    return product;
  }

  async deleteProduct(productId: string): Promise<void> {
    await this.validateAndFetchProduct(productId, "deleteProduct");
    await this.productRepository.deleteById(productId);
  }

  private async validateObjectId(productId: string, operation: string): Promise<void> {
    if (!isValidObjectId(productId)) {
      throw new BadRequestError({
        message: "Invalid product ID format",
        code: 400,
        context: {
          productId,
          operation,
          timestamp: new Date().toISOString(),
        },
      });
    }
  }

  private async validateAndFetchProduct(productId: string, operation: string): Promise<IProduct> {
    await this.validateObjectId(productId, operation);

    const product = await this.productRepository.getById(productId);
    if (!product) {
      throw new BadRequestError({
        message: "Product not found",
        code: 404,
        context: {
          productId,
          operation,
          timestamp: new Date().toISOString(),
        },
      });
    }
    return product;
  }
}
