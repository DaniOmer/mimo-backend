import { Schema, model } from "mongoose";
import { IProduct } from "./product.interface";

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    isActive: { type: Boolean, required: true, default: true },
    images: [{ type: Schema.Types.ObjectId, ref: "ProductImage" }],
    categoryIds: [{ type: Schema.Types.ObjectId, ref: "Category", required: true }],
    featureIds: [{ type: Schema.Types.ObjectId, ref: "ProductFeature" }],
    createdBy: { type: Schema.ObjectId, ref: "User", required: true }, 
    updatedBy: { type: Schema.ObjectId, ref: "User", default: null},
    description: { type: String, default: null },
    priceEtx: { type: Number, required: false },
    priceVat: { type: Number, required: false },
    stripeId: { type: String, unique: true, required: false, sparse: true},

  },
  { timestamps: true, collection: "products", versionKey: false }
);

export const ProductModel = model<IProduct>("Product", ProductSchema);
