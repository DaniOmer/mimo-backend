import { Document, Types } from "mongoose";
import { Timestamps } from "../../../../librairies/types/timestamps.interface";
import { ObjectId } from "mongodb";
import { IUser } from "../../../auth/data-access";

export enum OrderStatus {
  Pending = "pending",
  Paid = "paid",
  Shipped = "shipped",
  Delivered = "delivered",
  Canceled = "canceled",
}

interface IAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface IOrder extends Timestamps, Document {
  _id: string;
  orderNumber: string;
  orderDate: Date;
  shipDate?: Date;
  status: OrderStatus;
  priceEtx: number;
  priceVat: number;
  user: ObjectId | IUser;
  shippingAddress: IAddress;
  billingAddress: IAddress;
}