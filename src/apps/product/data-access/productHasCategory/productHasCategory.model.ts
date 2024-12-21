import { Schema, model } from "mongoose";
import { IProductHasCategory } from "./productHasCategory.interface";

const ProductHasCategorySchema = new Schema<IProductHasCategory>(
  {
    product_id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    category_id: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  },
  { timestamps: true, collection: "product_has_categories", versionKey: false }
);

export const ProductHasCategoryModel = model<IProductHasCategory>(
  "ProductHasCategory",
  ProductHasCategorySchema
);
