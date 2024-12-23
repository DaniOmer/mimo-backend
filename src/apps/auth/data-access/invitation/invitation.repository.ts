import { InvitationModel } from "./invitation.model";
import { IInvitation } from "./invitation.interface";
import { Types } from "mongoose";

export class InvitationRepository {
  async create(invitationData: Partial<IInvitation>): Promise<IInvitation> {
    const newInvitation = new InvitationModel(invitationData);
    return await newInvitation.save();
  }

  async findByEmail(email: string): Promise<IInvitation | null> {
    return await InvitationModel.findOne({ email }).exec();
  }

  async findByToken(tokenId: Types.ObjectId | string): Promise<IInvitation | null> {
    return await InvitationModel.findOne({ token: tokenId })
      .populate("admin")
      .populate("token")
      .populate("role")
      .exec();
  }

  async deleteById(id: Types.ObjectId | string): Promise<void> {
    await InvitationModel.findByIdAndDelete(id).exec();
  }

}
