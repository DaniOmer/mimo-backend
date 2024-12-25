import { Document, Types } from "mongoose";
import { Timestamps } from "../../../../librairies/types/timestamps.interface";
import { ObjectId } from "mongoose";
import { IUser } from "../../../auth/data-access";

export interface ICart extends Timestamps, Document {
  _id: ObjectId;
  user: ObjectId | IUser;
  priceEtx: number;
  priceVat: number;
}
