import { InvitationModel } from "./invitation.model";
import { IInvitation } from "./invitation.interface";
import { Types } from "mongoose";
import { MongooseRepository } from "../../../../librairies/repositories/mongoose/mongoose.repository";

export class InvitationRepository  extends MongooseRepository<IInvitation>{

    constructor() {
        super(InvitationModel);
    }

    async findByEmail(email: string): Promise<IInvitation | null> {
      return await this.model.findOne({ email }).exec();
    }

    async findByToken(tokenId: Types.ObjectId | string): Promise<IInvitation | null> {
      return await this.model
        .findOne({ token: tokenId })
        .populate("admin")
        .populate("token")
        .populate("role")
        .exec();
    }

}
