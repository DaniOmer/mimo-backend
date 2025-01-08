import { Document } from "mongoose";
import { Timestamps } from "../../../../librairies/types/timestamps.interface";

export interface IProductFeature extends Document, Timestamps {
  _id: string;
  name: string; 
  description?: string; 
}
