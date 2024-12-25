import { Document, Types } from "mongoose";
import { IProduct, IProductVariant } from "../../../product/data-access";
import { IOrder } from "../../order/data-access";

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface IOrderItem extends Document {
  product: Types.ObjectId | IProduct;
  productVariant: Types.ObjectId | IProductVariant;
  order: Types.ObjectId | IOrder;
  quantity: number;
  priceEtx: number;
  priceVat: number;
  subTotal: number;
}
