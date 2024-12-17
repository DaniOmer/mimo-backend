import { Types } from "mongoose";
import { IUser, Role } from "./user.interface";
import { IToken } from "./token.interface";


export interface IInvitation {
  firstName: string;
  lastName: string;
  email: string;
  admin: Types.ObjectId | IUser; 
  role: Role;
  token: Types.ObjectId | IToken; 
  createdAt?: Date;
  updatedAt?: Date;
}