import { Document, ObjectId, Mixed } from "mongoose";
import { PaymentCurrencyType } from "../../../../config/store";
import { IUser } from "../../../auth/data-access";
import { IPaymentMethod } from "../method/method.interface";

export enum PaymentStatus {
  Pending = "pending",
  Completed = "completed",
  Failed = "failed",
  Refunded = "refunded",
}

export interface IPayment extends Document {
  user: ObjectId | IUser;
  paymentMethod: ObjectId | IPaymentMethod;
  amount: number;
  currency: PaymentCurrencyType;
  status: PaymentStatus;
  metadata: Mixed;
}
