import { Document } from "mongoose";
import { Timestamps } from "../../../librairies/types/timestamps.interface";

export interface IPermission extends Timestamps, Document {
  _id: string;
  name: string;
}
