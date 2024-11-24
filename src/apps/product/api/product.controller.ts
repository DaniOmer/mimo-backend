import { Request, Response, NextFunction } from "express";
import { ProductService } from "../domain/product.service";
import { ApiResponse } from "../../../librairies/controllers/api.response";

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  async createProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const newProduct = await this.productService.createProduct(req.body);
      ApiResponse.success(res, "Product created successfully", newProduct, 201);
    } catch (error) {
      next(error);
    }
  }

  async listProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const products = await this.productService.listProducts();
      ApiResponse.success(res, "Products retrieved successfully", products, 200);
    } catch (error) {
      next(error);
    }
  }

  async getProductById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await this.productService.getProductById(req.params.id);
      if (!product) {
        ApiResponse.error(res, "Product not found", 404);
        return;
      }
      ApiResponse.success(res, "Product retrieved successfully", product, 200);
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updatedProduct = await this.productService.updateProduct(req.params.id, req.body);
      if (!updatedProduct) {
        ApiResponse.error(res, "Product not found", 404);
        return;
      }
      ApiResponse.success(res, "Product updated successfully", updatedProduct, 200);
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await this.productService.getProductById(req.params.id);
      if (!product) {
        ApiResponse.error(res, "Product not found", 404);
        return;
      }
      await this.productService.deleteProduct(req.params.id);
      ApiResponse.success(res, "Product deleted successfully", null, 204);
    } catch (error) {
      next(error);
    }
  }
}
