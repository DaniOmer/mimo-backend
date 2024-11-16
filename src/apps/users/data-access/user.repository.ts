import { IUser } from "./user.schema";
import { UserModel } from "./user.model";
import { MongooseRepository } from "../../../librairies/repositories/mongoose/mongoose.repository";

export class UserRepository extends MongooseRepository<IUser> {
  constructor() {
    super(UserModel);
  }

  async getByEmail(email: string): Promise<IUser | null> {
    const user = this.model.findOne({ email }).exec();
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
}
