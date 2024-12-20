import { ObjectId, Document } from "mongoose";
import { Timestamps } from "../../../../librairies/types/timestamps.interface";

export interface IIventory extends Document, Timestamps {
  _id: string;
  productId: ObjectId;
  productVariantId?: ObjectId;
  quantity: number;
  reservedQuantity: number;
  warehouseId?: ObjectId;
  lastUpdatedById?: ObjectId;
}
