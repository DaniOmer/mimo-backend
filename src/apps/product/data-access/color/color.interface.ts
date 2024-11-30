import { Document } from "mongoose";
import { Timestamps } from "../../../../librairies/types/timestamps.interface";

export interface IColor extends Document, Timestamps {
  _id: string;
  name: string; 
  hexCode: string; 
  isTrending?: boolean; 
  colorGroup?: string; 
}
