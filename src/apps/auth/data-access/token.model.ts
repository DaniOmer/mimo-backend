import { Schema, model } from "mongoose";
import { IToken, TokenType } from "./token.interface";

const tokenSchema = new Schema<IToken>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hash: { type: String, required: true },
    type: { type: String, enum: Object.values(TokenType), required: true },
    expiresAt: { type: Date, required: true },
    isDisabled: { type: Boolean, required: true, default: false },
  },
  { timestamps: true, collection: "tokens", versionKey: false }
);

export const TokenModel = model<IToken>("Token", tokenSchema);
