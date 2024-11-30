import { Schema, model } from "mongoose";
import { ICategory } from "./category.interface";

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    description: { type: String },
    parentId: { type: Schema.Types.ObjectId, ref: "Category", default: null },
  },
  { timestamps: true, collection: "categories", versionKey: false }
);

export const CategoryModel = model<ICategory>("Category", CategorySchema);
