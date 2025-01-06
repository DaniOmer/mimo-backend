import { Request, Response, NextFunction } from "express";
import { CategoryService } from "../../domain/category/category.service";
import { ApiResponse } from "../../../../librairies/controllers/api.response";

export class CategoryController {
  private service: CategoryService;

  constructor() {
    this.service = new CategoryService();
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = await this.service.createCategory(req.body);
      ApiResponse.success(res, "Category created successfully", category, 201);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await this.service.getAllCategories();
      ApiResponse.success(
        res,
        "Categories retrieved successfully",
        categories,
        200
      );
    } catch (error) {
      next(error);
    }
  }

  async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const category = await this.service.getCategoryById(req.params.id);
      ApiResponse.success(
        res,
        "Category retrieved successfully",
        category,
        200
      );
    } catch (error) {
      next(error);
    }
  }

  async updateById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const updatedCategory = await this.service.updateCategoryById(
        req.params.id,
        req.body
      );
      ApiResponse.success(
        res,
        "Category updated successfully",
        updatedCategory,
        200
      );
    } catch (error) {
      next(error);
    }
  }

  async deleteById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const deletedCategory = await this.service.deleteCategoryById(
        req.params.id
      );
      ApiResponse.success(
        res,
        "Category deleted successfully",
        deletedCategory,
        204
      );
    } catch (error) {
      next(error);
    }
  }
}
