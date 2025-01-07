import mongoose, { Schema } from "mongoose";

import { IInvoice } from "./invoice.interface";

export const InvoiceSchema = new Schema<IInvoice>({
  user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  payment: { type: Schema.Types.ObjectId, required: true, ref: "Payment" },
  number: { type: String, required: true, unique: true },
});

export const InvoiceModel = mongoose.model<IInvoice>("Invoice", InvoiceSchema);
