import { Schema, model } from "mongoose";
import { ICartItem } from "./cartItem.interface";

export const cartItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: false,
      default: null,
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
    subTotal: {
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

export const CartItemModel = model<ICartItem>("CartItem", cartItemSchema);
