import { Schema, model } from "mongoose";
import { Role, IUser } from "./user.interface";

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, required: false, default: null },
    role: { type: String, enum: Object.values(Role), default: Role.User },
    isTermsOfSale: { type: Boolean, default: false },
  },
  { timestamps: true, collection: "users", versionKey: false }
);

export const UserModel = model<IUser>("User", userSchema);
