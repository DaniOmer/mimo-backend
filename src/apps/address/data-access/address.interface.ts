import { Document, ObjectId } from "mongoose";
import { IUser } from "../../auth/data-access";
import { Timestamps } from "../../../librairies/types/timestamps.interface";

export interface IAddress extends Timestamps, Document {
  _id: string;
  firstName: string;
  lastName: string;
  streetNumber: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isBilling: boolean;
  isShipping: boolean;
  isDefault: boolean;
  user: ObjectId | IUser;
}
