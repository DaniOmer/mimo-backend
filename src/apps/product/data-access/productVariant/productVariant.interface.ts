import { Document, Types } from "mongoose";
import { Timestamps } from "../../../../librairies/types/timestamps.interface";

export interface IProductVariant extends Document, Timestamps {
  _id: string;
  price_etx: number;
  price_vat: number;
  quantity: number;
  stripe_id?: string;
  product_id: Types.ObjectId;
  size_id: Types.ObjectId;
  color_id: Types.ObjectId;
  material?: string;
  weight: number;
  isLimitedEdition?: boolean;
}

