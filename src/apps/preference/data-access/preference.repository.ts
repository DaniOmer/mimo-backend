import { MongooseRepository } from "../../../librairies/repositories";
import { IUserPreference } from "./preference.interface";
import { PreferenceModel } from "./preference.model";

export class PreferenceRepository extends MongooseRepository<IUserPreference> {
  constructor() {
    super(PreferenceModel);
  }

  async getPreferenceByUser(userId: string): Promise<IUserPreference | null> {
    return this.model.findOne({ user: userId });
  }
}
