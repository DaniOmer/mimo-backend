import { Schema, model } from "mongoose";
import { IRole, RoleHasPermission } from "./role.interface";

// Role
const roleSchema = new Schema<IRole>(
  {
    name: { type: String, required: true },
  },
  { timestamps: true, collection: "roles", versionKey: false }
);

export const RoleModel = model<IRole>("Role", roleSchema);

// RoleHasPermission
const roleHasPersmissionSchema = new Schema<RoleHasPermission>(
  {
    role: { type: Schema.Types.ObjectId, ref: "Role", required: true },
    permission: {
      type: Schema.Types.ObjectId,
      ref: "Permission",
      required: true,
    },
  },
  { timestamps: true, collection: "role_has_permissions", versionKey: false }
);

export const RoleHasPermissionModel = model<RoleHasPermission>(
  "RoleHasPermission",
  roleHasPersmissionSchema
);
