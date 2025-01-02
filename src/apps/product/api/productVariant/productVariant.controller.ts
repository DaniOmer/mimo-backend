import { Request, Response, NextFunction } from "express";
import { ProductVariantService } from "../../domain/productVariant/productVariant.service";
import { ApiResponse } from "../../../../librairies/controllers/api.response";

export class ProductVariantController {
  private productVariantService: ProductVariantService;

  constructor() {
    this.productVariantService = new ProductVariantService();
  }

  async createVariant(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const newVariant = await this.productVariantService.createProductVariant(req.body);
      ApiResponse.success(res, "Product Variant created successfully", newVariant, 201);
    } catch (error) {
      next(error);
    }
  }

  async getAllVariants(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const variants = await this.productVariantService.getAllVariants();
      ApiResponse.success(res, "Product Variants retrieved successfully", variants, 200);
    } catch (error) {
      next(error);
    }
  }

  async getVariantById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const variant = await this.productVariantService.getProductVariantById(req.params.id);
      ApiResponse.success(res, "Product Variant retrieved successfully", variant, 200);
    } catch (error) {
      next(error);
    }
  }

  async updateVariantById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updatedVariant = await this.productVariantService.updateVariantById(req.params.id, req.body);
      ApiResponse.success(res, "Product Variant updated successfully", updatedVariant, 200);
    } catch (error) {
      next(error);
    }
  }

  async deleteVariantById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.productVariantService.deleteVariantById(req.params.id);
      ApiResponse.success(res, "Product Variant deleted successfully", null, 204);
    } catch (error) {
      next(error);
    }
  }


  async searchVariants(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = req.query;
      const variants = await this.productVariantService.searchVariants(filters);
      ApiResponse.success(res, "Product Variants retrieved successfully", variants, 200);
    } catch (error) {
      next(error);
    }
  }


  async getLimitedEditionVariants(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const variants = await this.productVariantService.getLimitedEditionVariants();
      ApiResponse.success(res, "Limited Edition Product Variants retrieved successfully", variants, 200);
    } catch (error) {
      next(error);
    }
  }

  async duplicateVariant(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const duplicatedVariant = await this.productVariantService.duplicateVariant(id);
      ApiResponse.success(res, "Product Variant duplicated successfully", duplicatedVariant, 201);
    } catch (error) {
      next(error);
    }
  }
}
