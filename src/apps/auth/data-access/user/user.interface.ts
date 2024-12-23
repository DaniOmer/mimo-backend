import { Document } from "mongoose";
import { Timestamps } from "../../../../librairies/types/timestamps.interface";
import { IRole } from "../role/role.interface";
import { IPermission } from "../permission/permission.interface";

export enum AuthType {
  Basic = "basic",
  Social = "social",
}

export interface IUser extends Timestamps, Document {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  avatar?: string;
  roles: IRole[];
  permissions: IPermission[];
  isTermsOfSale: boolean;
  isVerified: boolean;
  isDisabled: boolean;
  authType: AuthType;
  createdBy?: string;
}
