import { Schema, model } from "mongoose";
import { IProductHasProductFeature } from "./productHasProductFeature.interface";

const ProductHasProductFeatureSchema = new Schema<IProductHasProductFeature>(
  {
    product_id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    feature_id: { type: Schema.Types.ObjectId, ref: "ProductFeature", required: true },
    value: { type: String, required: true },
  },
  { timestamps: true, collection: "product_has_product_features", versionKey: false }
);

export const ProductHasProductFeatureModel = model<IProductHasProductFeature>(
  "ProductHasProductFeature",
  ProductHasProductFeatureSchema
);
