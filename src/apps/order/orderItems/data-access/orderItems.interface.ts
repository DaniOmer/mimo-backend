import { Document, Types } from "mongoose";

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}
export interface IOrderItem extends Document {
  productVariant_id: Types.ObjectId;
  order_id: Types.ObjectId;
  quantity: number;
  priceEtx: number;
  priceVat: number;
  subtotal: number;
  shippingAddress: Address;
  billingAddress: Address;
}