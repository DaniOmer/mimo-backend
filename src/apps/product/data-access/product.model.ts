import { Schema, model, Document } from "mongoose";
import { IProduct } from "./product.interface";

const ProductSchema = new Schema<IProduct>({
    name: { type: String, required: true },
    description: { type: String, default: null },
    }, { timestamps: true, collection: "products", versionKey: false
  });
  
export const ProductModel = model<IProduct>("Product", ProductSchema);