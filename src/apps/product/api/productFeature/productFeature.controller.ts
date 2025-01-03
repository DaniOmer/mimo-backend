
import { Request, Response, NextFunction } from "express";
import { ProductFeatureService } from "../../domain/productFeature/productFeature.service";
import { ApiResponse } from "../../../../librairies/controllers/api.response";

export class ProductFeatureController {
  private service: ProductFeatureService;

  constructor() {
    this.service = new ProductFeatureService();
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const feature = await this.service.createFeature(req.body);
      ApiResponse.success(res, "Feature created successfully", feature, 201);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const features = await this.service.getAllFeatures();
      ApiResponse.success(res, "Features retrieved successfully", features, 200);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const feature = await this.service.getFeatureById(req.params.id);
      ApiResponse.success(res, "Feature retrieved successfully", feature, 200);
    } catch (error) {
      next(error);
    }
  }

  async updateById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updatedFeature = await this.service.updateFeatureById(
        req.params.id,
        req.body
      );
      ApiResponse.success(res, "Feature updated successfully", updatedFeature, 200);
    } catch (error) {
      next(error);
    }
  }

  async deleteById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const deletedFeature = await this.service.deleteFeatureById(req.params.id);
      ApiResponse.success(res, "Feature deleted successfully", deletedFeature, 204);
    } catch (error) {
      next(error);
    }
  }
}
