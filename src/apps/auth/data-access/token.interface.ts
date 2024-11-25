import { Document } from "mongoose";
import { IUser } from "./user.interface";
import { Timestamps } from "../../../librairies/types/timestamps.interface";

export enum TokenType {
  Confirmation = "confirmation",
  Invitation = "invitation",
  PasswordReset = "passwordReset",
}

export interface IToken extends Timestamps, Document {
  _id: string;
  user: string | IUser;
  hash: string;
  type: TokenType;
  expiresAt: Date;
}
