import { Document, Types } from "mongoose";
import { Timestamps } from "../../../../librairies/types/timestamps.interface";

export interface IProductHasProductFeature extends Document, Timestamps {
  _id: string;
  product_id: Types.ObjectId; 
  feature_id: Types.ObjectId; 
  value: string; 
}
