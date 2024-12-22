import { Document, Types } from "mongoose";
import { Timestamps } from "../../../librairies/types/timestamps.interface";

export interface IProduct extends Document, Timestamps {
  _id: string;
  name: string;
  description?: string;
  basePrice?: number;
  isActive: boolean;
  images?: Types.ObjectId[];
  categoryIds: Types.ObjectId[];
  featureIds?: Types.ObjectId[];
  createdBy: Types.ObjectId;
  updatedBy?: Types.ObjectId;
}
