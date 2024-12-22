import mongoose, { Schema } from "mongoose";

import { IIventory } from "./inventory.interface";

export const InventorySchema = new Schema<IIventory>(
  {
    product: { type: Schema.Types.ObjectId, required: true, ref: "Product" },
    productVariant: { type: Schema.Types.ObjectId, ref: "ProductVariant" },
    quantity: { type: Number, required: true },
    reservedQuantity: { type: Number, default: 0 },
    warehouse: { type: Schema.Types.ObjectId, ref: "Warehouse" },
    lastUpdatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true, collection: "inventories", versionKey: false }
);

export const InventoryModel = mongoose.model<IIventory>(
  "Inventory",
  InventorySchema
);
