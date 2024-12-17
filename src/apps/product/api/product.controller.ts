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

  async getAllProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const products = await this.productService.getAllProducts();
      ApiResponse.success(res, "Products retrieved successfully", products, 200);
    } catch (error) {
      next(error);
    }
  }

  async getProductById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await this.productService.getProductById(req.params.id);
      ApiResponse.success(res, "Product retrieved successfully", product, 200);
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const productId = req.params.id;
      const updates = req.body;
      const updatedProduct = await this.productService.updateProductById(productId, updates);
      ApiResponse.success(res, "Product updated successfully", updatedProduct, 200);
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const productId = req.params.id;
      await this.productService.deleteProductById(productId);
      ApiResponse.success(res, "Product deleted successfully", null, 204);
    } catch (error) {
      next(error);
    }
  }
}
