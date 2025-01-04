import { Schema, model } from "mongoose";
import { IProduct } from "./product.interface";
import BadRequestError from "../../../config/error/bad.request.config";

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    isActive: { type: Boolean, required: true, default: true },
    images: [{ type: Schema.Types.ObjectId, ref: "ProductImage" }],
    categoryIds: [
      { type: Schema.Types.ObjectId, ref: "Category", required: true },
    ],
    featureIds: [{ type: Schema.Types.ObjectId, ref: "ProductFeature" }],
    createdBy: { type: Schema.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.ObjectId, ref: "User", default: null },
    description: { type: String, default: null },
    priceEtx: { type: Number, required: false },
    priceVat: { type: Number, required: false },
    stripeId: { type: String, unique: true, required: false, sparse: true },
    hasVariants: { type: Boolean, required: true, default: false },
  },
  { timestamps: true, collection: "products", versionKey: false }
);

ProductSchema.pre("validate", function (next) {
  if (!this.hasVariants) {
    if (!this.priceEtx || !this.priceVat) {
      return next(
        new BadRequestError({
          logging: true,
          message:
            "Both priceEtx and priceVat are required for a product without variants",
        })
      );
    }
  }
  next();
});

export const ProductModel = model<IProduct>("Product", ProductSchema);
