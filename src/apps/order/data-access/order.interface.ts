import { Document, Types } from "mongoose";
import { Timestamps } from "../../../librairies/types/timestamps.interface";

export enum OrderStatus {
  Pending = "pending",
  Paid = "paid",
  Shipped = "shipped",
  Delivered = "delivered",
  Canceled = "canceled",
}

export interface IOrder extends Timestamps, Document {
  _id: string;
  orderNumber: string;
  orderDate: Date;
  shipDate?: Date;
  status: OrderStatus;
  user_id: Types.ObjectId;
}