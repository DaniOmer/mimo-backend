import { Document } from "mongoose";
import { Timestamps } from "../../../librairies/types/timestamps.interface";

export enum Role {
  Admin = "admin",
  User = "user",
  Manager = "manager",
}

export interface IUser extends Timestamps, Document {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  avatar?: string;
  role: Role;
  isTermsOfSale: boolean;
}
