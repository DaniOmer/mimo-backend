import { PermissionModel } from "./permission.model";
import { IPermission } from "./permission.interface";
import { MongooseRepository } from "../../../../librairies/repositories/mongoose/mongoose.repository";

export default class PermissionRepository extends MongooseRepository<IPermission> {
  constructor() {
    super(PermissionModel);
  }

  async getByName(name: string): Promise<IPermission | null> {
    return this.model.findOne({ name }).exec();
  }
}
