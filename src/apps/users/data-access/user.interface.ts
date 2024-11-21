import { Document } from "mongoose";

export enum Role {
  Admin = "admin",
  User = "user",
  Manager = "manager",
}

export interface IUser extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  avatar?: string;
  role: Role;
  isTermsOfSale: boolean;
  createdAt: Date;
  updatedAt: Date;
}
