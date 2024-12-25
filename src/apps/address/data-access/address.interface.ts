import { Document, ObjectId } from "mongoose";
import { IUser } from "../../auth/data-access";
import { Timestamps } from "../../../librairies/types/timestamps.interface";

export enum AddressStatus {
  Active = "active",
  Inactive = "inactive",
}
export enum AddressType {
  Billing = "billing",
  Invoice = "invoice",
}

export interface IAddress extends Timestamps, Document {
  _id: string;
  streetNumber: number;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  type: AddressType;
  status: AddressStatus;
  user: ObjectId | IUser;
}
