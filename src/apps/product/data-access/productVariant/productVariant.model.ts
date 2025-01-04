import { Schema, model } from "mongoose";
import { IProductVariant } from "./productVariant.interface";

const ProductVariantSchema = new Schema<IProductVariant>(
  {
    priceEtx: { type: Number, required: true },
    priceVat: { type: Number, required: true },
    stripeId: { type: String, unique: true, sparse: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    size: { type: Schema.Types.ObjectId, ref: "Size", required: true },
    color: { type: Schema.Types.ObjectId, ref: "Color", required: true },
    material: { type: String },
    weight: { type: Number, required: true },
    isLimitedEdition: { type: Boolean, default: false },
  },
  { timestamps: true, collection: "product_variants", versionKey: false }
);

export const ProductVariantModel = model<IProductVariant>(
  "ProductVariant",
  ProductVariantSchema
);
