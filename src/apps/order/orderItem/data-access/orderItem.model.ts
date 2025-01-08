import { Schema, model } from "mongoose";
import { IOrderItem } from "./orderItem.interface";

const orderItemSchema = new Schema<IOrderItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productVariant: {
      type: Schema.Types.ObjectId,
      ref: "ProductVariant",
      required: false,
      default: null,
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    priceEtx: {
      type: Number,
      required: true,
      min: 0,
    },
    priceVat: {
      type: Number,
      required: true,
      min: 0,
    },
    subTotalEtx: {
      type: Number,
      required: true,
    },
    subTotalVat: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "orderItems",
    versionKey: false,
  }
);

export const OrderItemModel = model<IOrderItem>("OrderItem", orderItemSchema);
