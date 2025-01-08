import { Document, ObjectId } from "mongoose";
import { Timestamps } from "../../../../librairies/types/timestamps.interface";
import { IProduct } from "../product.interface";
import { IProductVariant } from "../productVariant/productVariant.interface";

export interface IIventory extends Document, Timestamps {
  _id: string;
  product: ObjectId | IProduct;
  productVariant?: ObjectId | IProductVariant;
  quantity: number;
  reservedQuantity: number;
  warehouse?: string;
  lastUpdatedBy?: string;
}
