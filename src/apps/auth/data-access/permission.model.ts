import { Schema, model } from "mongoose";
import { IPermission } from "./permission.interface";

export const schema = new Schema<IPermission>(
  {
    name: { type: String, required: true },
  },
  { timestamps: true, collection: "permissions", versionKey: false }
);

export const PermissionModel = model<IPermission>("Permission", schema);
