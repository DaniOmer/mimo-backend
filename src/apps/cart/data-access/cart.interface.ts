import { Document, Types } from "mongoose";
import { Timestamps } from "../../../librairies/types/timestamps.interface";
import { ICartItem } from "./cartItem.interface";

export interface ICart extends Timestamps, Document {
  _id: string;
  user_id: Types.ObjectId;
  items: ICartItem[];
  totalPrice: number;
}