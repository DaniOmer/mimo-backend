import { ObjectId, Document } from "mongoose";
import { Timestamps } from "../../../../librairies/types/timestamps.interface";
import { IIventory } from "../inventory/inventory.interface";
import { IUser } from "../../../auth/data-access";

export interface IReservedProduct extends Document, Timestamps {
  _id: string;
  inventoryId: string | IIventory;
  quantity: number;
  reservedById: string | IUser;
}
