import { Schema, model } from "mongoose";
import { OrderStatus, IOrder } from "./order.interface";

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    orderDate: {
      type: Date,
      required: true,
    },
    shipDate: {
      type: Date,
      required: false,
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Pending,
      required: true,
    },
    user_id: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
  },
  {
    timestamps: true,
    collection: "orders",
    versionKey: false
  }
);

export const OrderModel = model<IOrder>("Order", orderSchema);