import { Request, Response, NextFunction } from "express";
import { SizeService } from "../../domain/size/size.service";
import { ApiResponse } from "../../../../librairies/controllers/api.response";

export class SizeController {
  private service: SizeService;

  constructor() {
    this.service = new SizeService();
  }

  async createSize(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const size = await this.service.createSize(req.body);
      ApiResponse.success(res, "Size created successfully", size, 201);
    } catch (error) {
      next(error);
    }
  }

  async getAllSizes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sizes = await this.service.getAllSizes();
      ApiResponse.success(res, "Sizes retrieved successfully", sizes, 200);
    } catch (error) {
      next(error);
    }
  }

  async getSizeById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const size = await this.service.getSizeById(req.params.id);
      ApiResponse.success(res, "Size retrieved successfully", size, 200);
    } catch (error) {
      next(error);
    }
  }

  async updateSizeById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updatedSize = await this.service.updateSizeById(req.params.id, req.body);
      ApiResponse.success(res, "Size updated successfully", updatedSize, 200);
    } catch (error) {
      next(error);
    }
  }

  async deleteSizeById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const deletedSize = await this.service.deleteSizeById(req.params.id);
      ApiResponse.success(res, "Size deleted successfully", deletedSize, 204);
    } catch (error) {
      next(error);
    }
  }

  async deleteMultipleSizes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sizeIds } = req.body;
      await this.service.deleteMultipleSizes(sizeIds);
      ApiResponse.success(res, "Sizes deleted successfully", null, 200);
    } catch (error) {
      next(error);
    }
  }
}
