import { Document, Types } from "mongoose";
import { Timestamps } from "../../../../librairies/types/timestamps.interface";

export interface IProductImage extends Document, Timestamps {
  _id: string;
  product_id: Types.ObjectId;
  url: string;
  isPrimary?: boolean;
  altText?: string;
  resolution?: string;
  type?: string;
  order?: number;
}
