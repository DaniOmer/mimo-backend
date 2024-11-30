import { Schema, model } from "mongoose";
import { IProductImage } from "./productImage.interface";

const ProductImageSchema = new Schema<IProductImage>({
  product_id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  url: { type: String, required: true },
  isPrimary: { type: Boolean, default: false },
  altText: { type: String },
  resolution: { type: String },
  type: { type: String },
  order: { type: Number },
}, { timestamps: true });

export const ProductImageModel = model<IProductImage>("ProductImage", ProductImageSchema);
