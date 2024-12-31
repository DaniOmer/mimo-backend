import { Schema, model } from "mongoose";
import { IAddress, AddressStatus, AddressType } from "./address.interface";

export const addressSchema = new Schema<IAddress>(
  {
    streetNumber: {
      type: Number,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
    },
    postalCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(AddressStatus),
      default: AddressStatus.Inactive,
    },
    type: {
      type: String,
      enum: Object.values(AddressType),
      default: AddressType.Invoice,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    collection: "addresses",
    versionKey: false,
  }
);

export const AddressModel = model<IAddress>("Address", addressSchema);
