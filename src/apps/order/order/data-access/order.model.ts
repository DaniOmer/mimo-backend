import { Schema, model } from "mongoose";
import { OrderStatus, IOrder } from "./order.interface";

const addressSchema = new Schema(
  {
    street: { 
      type: String, 
      required: true 
    },
    city: { 
      type: String, 
      required: true 
    },
    state: { 
      type: String, 
      required: true 
    },
    postalCode: { 
      type: String, 
      required: true 
    },
    country: { 
      type: String, 
      required: true 
    },
  },
  { _id: false }
);

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
    priceEtx: { 
      type: Number, 
      required: true, 
      min: 0 
    },
    priceVat: { 
      type: Number, 
      required: true, 
      min: 0 
    },
    user: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    shippingAddress: {
      type: addressSchema,
      required: true,
    },
    billingAddress: {
      type: addressSchema,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "orders",
    versionKey: false
  }
);

export const OrderModel = model<IOrder>("Order", orderSchema);