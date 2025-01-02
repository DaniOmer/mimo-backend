import { IUser } from "./user.interface";
import { UserModel } from "./user.model";
import { MongooseRepository } from "../../../../librairies/repositories/mongoose/mongoose.repository";

export class UserRepository extends MongooseRepository<IUser> {
  constructor() {
    super(UserModel);
  }

  async getByEmail(email: string): Promise<IUser | null> {
    const user = this.model
      .findOne({ email })
      .populate("roles")
      .populate("permissions")
      .exec();
    return user;
  }

  async getUserById(id: string): Promise<IUser | null> {
    return this.model
      .findById(id)
      .populate("roles")
      .populate("permissions")
      .exec();
  }
}
