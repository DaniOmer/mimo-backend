import { Document, Types } from "mongoose";
import { Timestamps } from "../../../../librairies/types/timestamps.interface";

export interface ISize extends Document, Timestamps {
  _id: string;
  name: string; 
  dimensions: string; 
  volume?: number; 
  weightCapacity?: number; 
  isPopular?: boolean; 
}
