import mongoose, { Schema } from "mongoose";
import {
  IPaymentMethod,
  ICardDetails,
  IPayPalDetails,
} from "./method.interface";

const paymentMethodSchema = new Schema<IPaymentMethod>(
  {
    customer: { type: Schema.Types.ObjectId, ref: "User" },
    provider: { type: String, required: true },
    providerPaymentMethodId: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: "payment_methods",
    versionKey: false,
  }
);

export const PaymentMethodModel = mongoose.model<IPaymentMethod>(
  "PaymentMethod",
  paymentMethodSchema
);

export const CardPaymentMethodModel = PaymentMethodModel.discriminator(
  "Card",
  new Schema<ICardDetails>({
    brand: { type: String, required: true },
    last4: { type: String, required: true },
    expMonth: { type: Number, required: true },
    expYear: { type: Number, required: true },
  })
);

export const PayPalPaymentMethodModel = PaymentMethodModel.discriminator(
  "PayPal",
  new Schema<IPayPalDetails>({
    email: { type: String, required: true },
    payerId: { type: String, required: true },
  })
);
