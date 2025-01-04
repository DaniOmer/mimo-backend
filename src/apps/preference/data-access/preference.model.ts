import { Schema, model } from "mongoose";
import { IUserPreference } from "./preference.interface";

const UserPreferencesSchema = new Schema<IUserPreference>(
  {
    user: { type: String, required: true, unique: true },
    notifications: {
      email: { type: Boolean, default: false },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: false },
    },
    marketingConsent: { type: Boolean, default: false },
    personalizedAds: { type: Boolean, default: false },
    language: { type: String, default: "en" },
    currency: { type: String, default: "USD" },
  },
  {
    timestamps: true,
    collection: "preferences",
    versionKey: false,
  }
);

export const PreferenceModel = model<IUserPreference>(
  "UserPreferences",
  UserPreferencesSchema
);
