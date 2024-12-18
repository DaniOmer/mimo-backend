import { Schema, model } from "mongoose";
import { IOrderItem } from "./orderItems.interface";

const orderItemSchema = new Schema<IOrderItem>(
  {
    product_id: { 
      type: Schema.Types.ObjectId, 
      ref: "Product", 
      required: false,
      default: null,
    },
    productVariant_id: { 
      type: Schema.Types.ObjectId, 
      ref: "ProductVariant", 
      required: false,
      default: null,
    },
    order_id: { 
      type: Schema.Types.ObjectId, 
      ref: "Order", 
      required: true 
    },
    quantity: { 
      type: Number, 
      required: true, 
      min: 1 
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
    subtotal: {
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