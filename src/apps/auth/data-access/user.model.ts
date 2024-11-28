import { Schema, model } from "mongoose";
import { Role, AuthType, IUser } from "./user.interface";

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, required: false, default: null },
    role: { type: String, enum: Object.values(Role), default: Role.User },
    isTermsOfSale: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    isDisabled: { type: Boolean, default: false },
    authType: { type: String, enum: Object.values(AuthType), required: true },
  },
  { timestamps: true, collection: "users", versionKey: false }
);

export const UserModel = model<IUser>("User", userSchema);
