import { Document, Types } from "mongoose";
import { Timestamps } from "../../../../librairies/types/timestamps.interface";
import { IColor } from "../color/color.interface";
import { ISize } from "../size/size.interface";
import { IProduct } from "../product.interface";

export interface IProductVariant extends Document, Timestamps {
  _id: string;
  priceEtx: number;
  priceVat: number;
  stripeId?: string;
  product: string | IProduct;
  size: string | ISize;
  color: string | IColor;
  material?: string;
  weight: number;
  isLimitedEdition?: boolean;
}
