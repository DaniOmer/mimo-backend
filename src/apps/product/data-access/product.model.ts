import { Schema, model } from "mongoose";
import { IProduct } from "./product.interface";

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, default: null },
    priceEtx: { type: Number, required: false },
    priceVat: { type: Number, required: false },
    stripeId: { type: String, unique: true, required: false },
  },
  { timestamps: true, collection: "products", versionKey: false }
);

export const ProductModel = model<IProduct>("Product", ProductSchema);
