import { Document, ObjectId } from "mongoose";
import { Timestamps } from "../../../../librairies/types/timestamps.interface";

export interface IIventory extends Document, Timestamps {
  _id: string;
  productId: ObjectId;
  productVariantId?: string;
  quantity: number;
  reservedQuantity: number;
  warehouseId?: string;
  lastUpdatedById?: string;
}
