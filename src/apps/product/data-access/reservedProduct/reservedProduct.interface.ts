import { ObjectId, Document } from "mongoose";
import { Timestamps } from "../../../../librairies/types/timestamps.interface";

export interface IReservedProduct extends Document, Timestamps {
  _id: string;
  inventoryId: ObjectId;
  quantity: number;
  reservedById: ObjectId;
  reservedUntil: Date;
}
