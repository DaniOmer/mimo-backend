import mongoose, { Schema } from "mongoose";
import { IReservedProduct } from "./reservedProduct.interface";

export const ReservedProductSchema = new Schema<IReservedProduct>(
  {
    inventoryId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Inventory",
    },
    quantity: { type: Number, required: true },
    reservedById: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true, collection: "reserved_products", versionKey: false }
);

export const ReservedProductModel = mongoose.model<IReservedProduct>(
  "ReservedProduct",
  ReservedProductSchema
);
