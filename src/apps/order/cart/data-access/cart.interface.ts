import { Document, Types } from "mongoose";
import { Timestamps } from "../../../../librairies/types/timestamps.interface";
import { ICartItem } from "./cartItem.interface";
import { ObjectId } from "mongodb";
import { IUser } from "../../../auth/data-access";

export interface ICart extends Timestamps, Document {
  _id: string;
  user: ObjectId | IUser;
  items: ICartItem[];
  totalPrice: number;
}