import { Document } from "mongoose";
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
  product: string | IProduct;
  productVariant: string | IProductVariant | null;
  order: string | IOrder;
  quantity: number;
  priceEtx: number;
  priceVat: number;
  subTotalEtx: number;
  subTotalVat: number;
}
