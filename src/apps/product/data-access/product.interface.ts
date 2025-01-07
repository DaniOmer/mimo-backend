import { Document, Types } from "mongoose";
import { Timestamps } from "../../../librairies/types/timestamps.interface";
import { IUser } from "../../auth/data-access";

export interface IProduct extends Document, Timestamps {
  _id: string;
  name: string;
  description?: string;
  priceEtx?: number;
  priceVat?: number;
  isActive?: boolean;
  images?: string[];
  categoryIds: string[];
  featureIds?: string[];
  createdBy: string | IUser;
  updatedBy?: string | IUser;
  stripeId?: string;
  hasVariants: boolean;
}
