import mongoose, { Model, Document } from "mongoose";
import { IRepository } from "../repository.interface";

export class MongooseRepository<T extends Document> implements IRepository<T> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async getById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async getAll(): Promise<T[]> {
    return this.model.find().sort({ createdAt: -1 }).exec();
  }

  async create(item: Partial<T>, session?: mongoose.ClientSession): Promise<T> {
    const newItem = new this.model(item);
    return session ? newItem.save({ session }) : newItem.save();
  }

  async updateById(id: string, update: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, update, { new: true }).exec();
  }

  async deleteById(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec();
  }

  async deleteMany(filter: object): Promise<{ deletedCount?: number }> {
    return this.model.deleteMany(filter).exec();
  }
}
