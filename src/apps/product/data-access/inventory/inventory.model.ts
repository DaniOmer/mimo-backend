import mongoose, { Schema } from "mongoose";

import { IIventory } from "./inventory.interface";

export const InventorySchema = new Schema<IIventory>(
  {
    productId: { type: Schema.Types.ObjectId, required: true, ref: "Product" },
    productVariantId: { type: Schema.Types.ObjectId, ref: "ProductVariant" },
    quantity: { type: Number, required: true },
    reservedQuantity: { type: Number, default: 0 },
    warehouseId: { type: Schema.Types.ObjectId, ref: "Warehouse" },
    lastUpdatedById: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true, collection: "inventories", versionKey: false }
);

export const InventoryModel = mongoose.model<IIventory>(
  "Inventory",
  InventorySchema
);
