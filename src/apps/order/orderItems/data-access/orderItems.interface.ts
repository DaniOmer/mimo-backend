import { Document, Types } from "mongoose";

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}
export interface IOrderItem extends Document {
  product_id: Types.ObjectId | null;
  productVariant_id: Types.ObjectId | null;
  order_id: Types.ObjectId;
  quantity: number;
  priceEtx: number;
  priceVat: number;
  subtotal: number;
  shippingAddress: Address;
  billingAddress: Address;
}