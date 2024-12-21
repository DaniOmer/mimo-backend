import { Schema, model } from "mongoose";
import { IProductVariant } from "./productVariant.interface";

const ProductVariantSchema = new Schema<IProductVariant>(
  {
    price_etx: { type: Number, required: true },
    price_vat: { type: Number, required: true },
    quantity: { type: Number, required: true },
    stripe_id: { type: String, unique: true, sparse: true },
    product_id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    size_id: { type: Schema.Types.ObjectId, ref: "Size", required: true },
    color_id: { type: Schema.Types.ObjectId, ref: "Color", required: true },
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
