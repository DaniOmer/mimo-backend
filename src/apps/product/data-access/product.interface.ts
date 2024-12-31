import { Document } from "mongoose";
import { Timestamps } from "../../../librairies/types/timestamps.interface";

export interface IProduct extends Document, Timestamps {
  _id: string;
  name: string;
  description?: string;
  priceEtx?: number;
  priceVat?: number;
  stripeId?: string;
}
