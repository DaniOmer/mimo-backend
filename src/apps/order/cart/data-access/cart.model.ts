import { Schema, model } from "mongoose";
import { ICart } from "./cart.interface";

const cartItemSchema = new Schema(
  {
    orderItem_id: { 
      type: Schema.Types.ObjectId,
      ref: "OrderItem",
      required: true 
    },
    quantity: { 
      type: Number, 
      required: true 
    },
    price: { 
      type: Number, 
      required: true 
    },
  },
  {
    timestamps: true,
    collection: "cartItems",
    versionKey: false
  }
);

const cartSchema = new Schema<ICart>(
  {
    user: { 
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true, 
      unique: true 
    },
    items: { 
      type: [cartItemSchema], 
      default: [] 
    },
    totalPrice: { 
      type: Number, 
      required: true, 
      default: 0
    },
  },
  {
    timestamps: true,
    collection: "carts",
    versionKey: false,
  }
);

export const CartModel = model<ICart>("Cart", cartSchema);