import { Document, ObjectId } from "mongoose";
import { Timestamps } from "../../../librairies/types/timestamps.interface";
import { IPermission } from "./permission.interface";

export interface IRole extends Timestamps, Document {
  _id: string;
  name: string;
  permissions: IPermission[];
}
