import { Document, ObjectId } from "mongoose";

export interface IPaymentMethod extends Document {
  customer: ObjectId;
  provider: string;
  providerPaymentMethodId: string;
  isDefault: boolean;
}

export interface ICardDetails extends Document {
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
}

export interface IPayPalDetails extends Document {
  email: string;
  payerId: string;
}
