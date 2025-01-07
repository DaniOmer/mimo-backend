import { Document, ObjectId } from "mongoose";
import { Timestamps } from "../../../librairies/types/timestamps.interface";
import { IPayment } from "../../payment/data-access";
import { IUser } from "../../auth/data-access";

export interface IInvoice extends Document, Timestamps {
  _id: string;
  user:  IUser;
  payment: IPayment;
  number: string;
}
