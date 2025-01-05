import { Schema, model } from "mongoose";
import { IAddress } from "./address.interface";
import BadRequestError from "../../../config/error/bad.request.config";

export const addressSchema = new Schema<IAddress>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    streetNumber: {
      type: String,
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
    isDefault: {
      type: Boolean,
      default: false,
    },
    isBilling: {
      type: Boolean,
      default: false,
    },
    isShipping: {
      type: Boolean,
      default: false,
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

addressSchema.pre("validate", function (next) {
  if (!this.isBilling && !this.isShipping) {
    return next(
      new BadRequestError({
        message: "At least one of 'isBilling' or 'isShipping' should be true.",
        logging: true,
        code: 400,
      })
    );
  }
  next();
});

export const AddressModel = model<IAddress>("Address", addressSchema);
