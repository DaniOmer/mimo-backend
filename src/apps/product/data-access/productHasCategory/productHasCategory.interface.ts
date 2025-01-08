import { Document, Types } from "mongoose";
import { Timestamps } from "../../../../librairies/types/timestamps.interface";

export interface IProductHasCategory extends Document, Timestamps {
  _id: string;
  productId: Types.ObjectId; 
  categoryId: Types.ObjectId; 
}
