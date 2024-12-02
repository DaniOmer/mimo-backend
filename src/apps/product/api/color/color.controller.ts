import { Request, Response, NextFunction } from "express";
import { ColorService } from "../../domain/color/color.service";
import { ApiResponse } from "../../../../librairies/controllers/api.response";

export class ColorController {
  private service: ColorService;

  constructor() {
    this.service = new ColorService();
  }

  async createColor(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const color = await this.service.createColor(req.body);
      ApiResponse.success(res, "Color created successfully", color, 201);
    } catch (error) {
      next(error);
    }
  }

  async getAllColors(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const colors = await this.service.getAllColors();
      ApiResponse.success(res, "Colors retrieved successfully", colors, 200);
    } catch (error) {
      next(error);
    }
  }

  async getColorById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const color = await this.service.getColorById(req.params.id);
      ApiResponse.success(res, "Color retrieved successfully", color, 200);
    } catch (error) {
      next(error);
    }
  }

  async updateColorById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updatedColor = await this.service.updateColorById(req.params.id, req.body);
      ApiResponse.success(res, "Color updated successfully", updatedColor, 200);
    } catch (error) {
      next(error);
    }
  }

  async deleteColorById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const deletedColor = await this.service.deleteColorById(req.params.id);
      ApiResponse.success(res, "Color deleted successfully", deletedColor, 204);
    } catch (error) {
      next(error);
    }
  }
}
