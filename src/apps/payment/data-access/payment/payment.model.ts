import mongoose, { Schema } from "mongoose";
import { IPayment, PaymentStatus } from "./payment.interface";

const paymentSchema = new Schema<IPayment>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    paymentMethod: { type: Schema.Types.ObjectId, ref: "PaymentMethod" },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    order: { type: Schema.Types.ObjectId, ref: "Order" },
    status: {
      type: String,
      enum: PaymentStatus,
      required: true,
    },
    metadata: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true,
    collection: "payments",
    versionKey: false,
  }
);

export const PaymentModel = mongoose.model<IPayment>("Payment", paymentSchema);
