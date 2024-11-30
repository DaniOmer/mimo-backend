import { Schema, model } from "mongoose";
import { IProductFeature } from "./productFeature.interface";

const ProductFeatureSchema = new Schema<IProductFeature>(
  {
    name: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true, collection: "product_features", versionKey: false }
);

export const ProductFeatureModel = model<IProductFeature>(
  "ProductFeature",
  ProductFeatureSchema
);
