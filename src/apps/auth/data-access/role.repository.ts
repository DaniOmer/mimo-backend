import { RoleModel } from "./role.model";
import { IRole } from "./role.interface";
import { MongooseRepository } from "../../../librairies/repositories/mongoose/mongoose.repository";

export default class RoleRepository extends MongooseRepository<IRole> {
  constructor() {
    super(RoleModel);
  }

  async getByName(name: string): Promise<IRole | null> {
    return this.model.findOne({ name }).exec();
  }

  async getRoleByIdWithPermissions(id: string): Promise<IRole | null> {
    return this.model.findById(id).populate("permissions").exec();
  }
}
