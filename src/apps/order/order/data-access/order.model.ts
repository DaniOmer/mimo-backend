import { Schema, model } from "mongoose";
import { OrderStatus, IOrder } from "./order.interface";

const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    number: {
      type: String,
      required: true,
      unique: true,
    },
    shipDate: {
      type: Date,
      required: false,
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
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Pending,
      required: true,
    },
    shippingAddress: {
      type: Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    billingAddress: {
      type: Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "orders",
    versionKey: false,
  }
);

export const OrderModel = model<IOrder>("Order", orderSchema);
