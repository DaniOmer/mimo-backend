import { Schema, model } from "mongoose";
import { ICartItem } from "./cartItem.interface";

export const cartItemSchema = new Schema<ICartItem>(
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
    cart: {
      type: Schema.Types.ObjectId,
      ref: "Cart",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
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
    collection: "cartItems",
    versionKey: false,
  }
);

export const CartItemModel = model<ICartItem>("CartItem", cartItemSchema);
