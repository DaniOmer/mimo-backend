import { Document } from "mongoose";
import { Timestamps } from "../../../../librairies/types/timestamps.interface";
import { IPermission } from "../permission/permission.interface";

export enum RoleAvailable {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  USER = "user",
}

export interface IRole extends Timestamps, Document {
  _id: string;
  name: string;
  permissions: IPermission[];
}
