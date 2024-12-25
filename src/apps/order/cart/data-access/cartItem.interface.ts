import { ObjectId, Document } from "mongoose";
import { ICart } from "./cart.interface";
import { IProduct, IProductVariant } from "../../../product/data-access";
import { Timestamps } from "../../../../librairies/types/timestamps.interface";

export interface ICartItem extends Document, Timestamps {
  _id: ObjectId;
  product: ObjectId | IProduct;
  productVariant: ObjectId | IProductVariant;
  cart: ObjectId | ICart;
  priceEtx: number;
  priceVat: number;
  quantity: number;
  subTotal: number;
}
