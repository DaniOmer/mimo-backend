import { Document } from "mongoose";
import { Timestamps } from "../../../../librairies/types/timestamps.interface";
import { IUser } from "../../../auth/data-access";
import { IAddress } from "../../../address/data-access";

export enum OrderStatus {
  Pending = "pending",
  Completed = "completed",
  Shipped = "shipped",
  Delivered = "delivered",
  Canceled = "canceled",
}

export interface IOrder extends Timestamps, Document {
  _id: string;
  user: string | IUser;
  number: string;
  shipDate?: Date;
  status: OrderStatus;
  amountEtx: number;
  amountVat: number;
  shippingAddress: string | IAddress;
  billingAddress: string | IAddress;
}
