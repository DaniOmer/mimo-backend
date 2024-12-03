import { Schema, model } from "mongoose";
import { IColor } from "./color.interface";

const ColorSchema = new Schema<IColor>(
  {
    name: { type: String, required: true },
    hexCode: { type: String, required: true },
    isTrending: { type: Boolean, default: false },
    colorGroup: { type: String },
  },
  { timestamps: true, collection: "colors", versionKey: false }
);

export const ColorModel = model<IColor>("Color", ColorSchema);

