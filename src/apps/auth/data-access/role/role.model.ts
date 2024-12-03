import { Schema, model } from "mongoose";
import { IRole } from "./role.interface";

// Role
const roleSchema = new Schema<IRole>(
  {
    name: { type: String, required: true },
    permissions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Permission",
      },
    ],
  },
  { timestamps: true, collection: "roles", versionKey: false }
);

export const RoleModel = model<IRole>("Role", roleSchema);
