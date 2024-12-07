import { ObjectId } from "mongodb";
import { IOrderItem } from "../../orderItems/data-access";

export interface ICartItem {
  orderItem: ObjectId | IOrderItem;
  quantity: number;
  price: number;
}