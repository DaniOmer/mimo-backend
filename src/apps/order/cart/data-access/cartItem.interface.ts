import { Document } from "mongoose";
import { ICart } from "./cart.interface";
import { IProduct, IProductVariant } from "../../../product/data-access";
import { Timestamps } from "../../../../librairies/types/timestamps.interface";

export interface ICartItem extends Document, Timestamps {
  _id: string;
  product: string | IProduct;
  productVariant: string | IProductVariant;
  cart: string | ICart;
  priceEtx: number;
  priceVat: number;
  quantity: number;
  subTotal: number;
}
