import { Document, Types } from "mongoose";
import { Timestamps } from "../../../../librairies/types/timestamps.interface";

export interface IProductHasCategory extends Document, Timestamps {
  _id: string;
  product_id: Types.ObjectId; 
  category_id: Types.ObjectId; 
}
