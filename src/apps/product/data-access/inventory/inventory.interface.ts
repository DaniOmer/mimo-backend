import { Document } from "mongoose";
import { Timestamps } from "../../../../librairies/types/timestamps.interface";

export interface IIventory extends Document, Timestamps {
  _id: string;
  productId: string;
  productVariantId?: string;
  quantity: number;
  reservedQuantity: number;
  warehouseId?: string;
  lastUpdatedById?: string;
}
