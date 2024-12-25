import { Schema, model } from "mongoose";
import { ICart } from "./cart.interface";

const cartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    priceEtx: {
      type: Number,
      required: true,
      default: 0,
    },
    priceVat: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: "carts",
    versionKey: false,
  }
);

export const CartModel = model<ICart>("Cart", cartSchema);
