import { MongooseRepository } from "../../../../librairies/repositories/mongoose/mongoose.repository";
import { CategoryModel } from "./category.model";
import { ICategory } from "./category.interface";

export class CategoryRepository extends MongooseRepository<ICategory> {
  constructor() {
    super(CategoryModel);
  }

  async getAllWithParent(): Promise<ICategory[]> {
    return this.model.find().populate("parentId").exec();
  }

  async findByIdWithParent(categoryId: string): Promise<ICategory | null> {
    return this.model.findById(categoryId).populate("parentId").exec();
  }

  async findByIds(categoryIds: string[]): Promise<ICategory[]> {
    return this.model.find({ _id: { $in: categoryIds } }).exec();
  }
}
