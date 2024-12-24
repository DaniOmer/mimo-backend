import { Request, Response, NextFunction } from "express";
import { ProductImageService } from "../../domain/productImage/productImage.service";
import { ApiResponse } from "../../../../librairies/controllers/api.response";

export class ProductImageController {
  private service: ProductImageService;

  constructor() {
    this.service = new ProductImageService();
  }

  async createProductImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const image = await this.service.createProductImage(req.body);
      ApiResponse.success(res, "Product image created successfully", image, 201);
    } catch (error) {
      next(error);
    }
  }

  async getImagesByProductId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const images = await this.service.getImagesByProductId(req.params.product_id);
      ApiResponse.success(res, "Product images retrieved successfully", images, 200);
    } catch (error) {
      next(error);
    }
  }

  async updateProductImageById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updatedImage = await this.service.updateProductImageById(req.params.id, req.body);
      ApiResponse.success(res, "Product image updated successfully", updatedImage, 200);
    } catch (error) {
      next(error);
    }
  }

  async deleteProductImageById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const deletedImage = await this.service.deleteProductImageById(req.params.id);
      ApiResponse.success(res, "Product image deleted successfully", deletedImage, 204);
    } catch (error) {
      next(error);
    }
  }
}
