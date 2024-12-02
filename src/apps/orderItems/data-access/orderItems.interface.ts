import { Document, Types } from "mongoose";

export interface IOrderItem extends Document {
  productVariant_id: Types.ObjectId;
  order_id: Types.ObjectId;
  quantity: number;
  priceEtx: number;
  priceVat: number;
}