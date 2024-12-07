import mongoose, { Document, ObjectId } from "mongoose";
import { PaymentCurrencyType } from "../../../config/store";
import { IUser } from "../../auth/data-access";

export enum PaymentStatus {
  Pending = "pending",
  Completed = "completed",
  Failed = "failed",
  Refunded = "refunded",
}

export interface IPaymentMethod extends Document {
  customer: ObjectId;
  provider: string;
  providerPaymentMethodId: string;
  type: string;
  details: {
    brand?: string;
    last4?: string;
    expMonth?: number;
    expYear?: number;
    mobileOperator?: string;
    phoneNumber?: string;
    iban?: string;
    swiftCode?: string;
    [key: string]: any;
  };
  isDefault: boolean;
}

export interface IPayment extends Document {
  user: ObjectId | IUser;
  paymentMethod: ObjectId | IPaymentMethod;
  amount: number;
  currency: PaymentCurrencyType;
  status: PaymentStatus;
  metadata: any;
}
