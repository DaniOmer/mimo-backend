import { Types } from "mongoose";

export interface ICartItem {
  orderItem_id: Types.ObjectId;
  quantity: number;
  price: number;
}