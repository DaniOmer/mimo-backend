import { Document } from "mongoose";
import { Timestamps } from "../../../../librairies/types/timestamps.interface";
import { IUser } from "../../../auth/data-access";

export interface ICart extends Timestamps, Document {
  _id: string;
  user: string | IUser;
  expireAt: Date;
}
