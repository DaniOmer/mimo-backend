import { Document } from "mongoose";
import { Timestamps } from "../../../librairies/types/timestamps.interface";
import { IUser } from "../../auth/data-access";

export interface IUserPreference extends Document, Timestamps {
  user: string | IUser;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  marketingConsent: boolean;
  personalizedAds: boolean;
  language: string;
  currency: string;
}
