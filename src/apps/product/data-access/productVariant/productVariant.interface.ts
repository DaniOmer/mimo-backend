import { Document, Types } from "mongoose";
import { Timestamps } from "../../../../librairies/types/timestamps.interface";

export interface IProductVariant extends Document, Timestamps {
  _id: string;
  priceEtx: number;
  priceVat: number;
  stripeId?: string;
  productId: Types.ObjectId;
  sizeId: Types.ObjectId;
  colorId: Types.ObjectId;
  material?: string;
  weight: number;
  isLimitedEdition?: boolean;
}
