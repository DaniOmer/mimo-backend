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
    expireAt: { type: Date, required: true },
  },
  {
    timestamps: true,
    collection: "carts",
    versionKey: false,
  }
);

export const CartModel = model<ICart>("Cart", cartSchema);
