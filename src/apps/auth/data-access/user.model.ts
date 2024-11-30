import { Schema, model } from "mongoose";
import { AuthType, IUser } from "./user.interface";
import { IRole } from "./role.interface";
import { IPermission } from "./permission.interface";

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, required: false, default: null },
    roles: [{ type: Schema.Types.ObjectId, ref: "Role", required: true }],
    permissions: [{ type: Schema.Types.ObjectId, ref: "Permission" }],
    isTermsOfSale: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    isDisabled: { type: Boolean, default: false },
    authType: { type: String, enum: Object.values(AuthType), required: true },
  },
  { timestamps: true, collection: "users", versionKey: false }
);

userSchema.pre("save", async function (next) {
  if (this.isNew) {
    await this.populate("roles");

    const permissions = [];
    for (const role of this.roles as IRole[]) {
      if (role.permissions && Array.isArray(role.permissions)) {
        permissions.push(...role.permissions);
      }
    }

    this.permissions = [...new Set(permissions)];
  }
  next();
});

export const UserModel = model<IUser>("User", userSchema);
