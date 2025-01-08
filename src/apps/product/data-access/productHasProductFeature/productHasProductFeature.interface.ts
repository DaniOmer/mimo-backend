import { Document, Types } from "mongoose";
import { Timestamps } from "../../../../librairies/types/timestamps.interface";

export interface IProductHasProductFeature extends Document, Timestamps {
  _id: string;
  productId: Types.ObjectId; 
  featureId: Types.ObjectId; 
  value: string; 
}
