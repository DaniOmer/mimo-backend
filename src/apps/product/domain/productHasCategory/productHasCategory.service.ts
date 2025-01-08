import { BaseService } from "../../../../librairies/services/base.service";
import { ProductHasCategoryRepository } from "../../data-access/";
import { IProductHasCategory } from "../../data-access/productHasCategory/productHasCategory.interface";
import { Types } from "mongoose";

export class ProductHasCategoryService extends BaseService {
  private repository: ProductHasCategoryRepository;

  constructor() {
    super("ProductHasCategory");
    this.repository = new ProductHasCategoryRepository();
  }


  async linkProductToCategory(
    productId: string,
    categoryId: string
  ): Promise<IProductHasCategory> {
    const productIdObject = this.toObjectId(productId);
    const categoryIdObject = this.toObjectId(categoryId);

    return this.repository.create({
      productId: productIdObject,
      categoryId: categoryIdObject,
    });
  }


  async unlinkProductFromCategory(id: string): Promise<IProductHasCategory> {
    const record = await this.repository.deleteById(id);
    return this.validateDataExists(record, id);
  }

  private toObjectId(id: string): Types.ObjectId {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error(`Invalid ObjectId: ${id}`);
    }
    return new Types.ObjectId(id);
  }
}
