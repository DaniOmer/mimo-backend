import { Schema, model } from "mongoose";
import { IInvitation } from "./invitation.interface";

const invitationSchema = new Schema<IInvitation>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    admin: { type: Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: Schema.Types.ObjectId, ref: "Token", required: true },
    role: { type: Schema.Types.ObjectId, ref: "Role", required: true },
  },
  { timestamps: true, collection: "invitations", versionKey: false }
);

export const InvitationModel = model<IInvitation>("Invitation", invitationSchema);
