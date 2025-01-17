import { BaseService } from "../../../../librairies/services/base.service";
import { CategoryRepository } from "../../data-access/category/category.repository";
import { ICategory } from "../../data-access/category/category.interface";
import BadRequestError from "../../../../config/error/bad.request.config";

interface FilterOption {
  value: string;
  label: string;
  checked: boolean;
}

interface Filter {
  id: string;
  name: string;
  options: FilterOption[];
}

interface FilterResponse {
  _id: string;
  name: string;
  type: string;
}

export class CategoryService extends BaseService {
  private repository: CategoryRepository;

  constructor() {
    super("Category");
    this.repository = new CategoryRepository();
  }

  async createCategory(data: Partial<ICategory>): Promise<ICategory> {
    if (data.parentId) {
      const parentCategory = await this.repository.getById(
        data.parentId.toString()
      );
      if (!parentCategory) {
        throw new BadRequestError({
          message: `Parent category not found for ID: ${data.parentId}`,
          code: 404,
        });
      }
    }
    return this.repository.create(data);
  }

  async getCategoryById(id: string): Promise<ICategory> {
    const category = await this.repository.findByIdWithParent(id);
    return this.validateDataExists(category, id);
  }

  async getAllCategories(): Promise<ICategory[]> {
    return this.repository.getAllWithParent();
  }

  async updateCategoryById(
    id: string,
    updates: Partial<ICategory>
  ): Promise<ICategory> {
    if (updates.parentId) {
      const parentCategory = await this.repository.getById(
        updates.parentId.toString()
      );
      if (!parentCategory) {
        throw new BadRequestError({
          message: `Parent category not found for ID: ${updates.parentId}`,
          context: { createdCategory: "Invalid parent category ID" },
          code: 404,
        });
      }
    }
    const updatedCategory = await this.repository.updateById(id, updates);
    return this.validateDataExists(updatedCategory, id);
  }

  async deleteCategoryById(id: string): Promise<ICategory> {
    const deletedCategory = await this.repository.deleteById(id);
    return this.validateDataExists(deletedCategory, id);
  }

  async findCategoriesByIds(categoryIds: string[]): Promise<ICategory[]> {
    return this.repository.findByIds(categoryIds);
  }

  async getFilters(): Promise<any> {
    const filters: FilterResponse[] = await this.repository.getFilters();

    const groupedFilters = filters.reduce(
      (acc: { [key: string]: Filter }, filter) => {
        if (!acc[filter.type]) {
          acc[filter.type] = {
            id: filter.type,
            name: filter.type.charAt(0).toUpperCase() + filter.type.slice(1),
            options: [],
          };
        }

        acc[filter.type].options.push({
          value: filter._id,
          label: filter.name,
          checked: false,
        });

        return acc;
      },
      {}
    );

    return Object.values(groupedFilters);
  }

  async deleteMultipleCategories(ids: string[]): Promise<void> {
    const result = await this.repository.deleteMany({ _id: { $in: ids } });
    if (result.deletedCount !== ids.length) {
      throw new Error(`Some categories could not be deleted.`);
    }
  }
}
