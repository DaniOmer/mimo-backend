import { Schema, model } from "mongoose";
import { ISize } from "./size.interface";

const SizeSchema = new Schema<ISize>(
  {
    name: { type: String, required: true },
    dimensions: { type: String, required: true},
    volume: { type: Number },
    weightCapacity: { type: Number },
    isPopular: { type: Boolean, default: false },
  },
  { timestamps: true, collection: "sizes", versionKey: false }
);

export const SizeModel = model<ISize>("Size", SizeSchema);
