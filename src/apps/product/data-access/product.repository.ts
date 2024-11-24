import {  IProduct } from "./product.interface";
import { ProductModel } from "./product.model";


export class ProductRepository {
  async create(data: Partial<IProduct>): Promise<IProduct> {
    return ProductModel.create(data);
  }

  async findAll(): Promise<IProduct[]> {
    return ProductModel.find().exec();
  }

  async findById(productId: string): Promise<IProduct | null> {
    return ProductModel.findById(productId).exec();
  }

  async update(productId: string, updates: Partial<IProduct>): Promise<IProduct | null> {
    return ProductModel.findByIdAndUpdate(productId, updates, { new: true }).exec();
  }

  async delete(productId: string): Promise<void> {
    await ProductModel.findByIdAndDelete(productId).exec();
  }
}
