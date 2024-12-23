import { Types } from "mongoose";
import { IUser } from "../user/user.interface";
import { Timestamps } from "../../../../librairies/types/timestamps.interface";
import { IToken } from "../token/token.interface";
import { IRole } from "../role/role.interface";

export interface IInvitation extends Timestamps, Document{
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  admin: Types.ObjectId | IUser; 
  role: Types.ObjectId | IRole;
  token: Types.ObjectId | IToken; 
}


