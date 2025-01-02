import { MongooseRepository } from "../../../librairies/repositories";
import { IAddress } from "./address.interface";
import { AddressModel } from "./address.model";

export class AddressRepository extends MongooseRepository<IAddress> {
  constructor() {
    super(AddressModel);
  }

  async getAllByTypeAndUserId(type: string, user: string): Promise<IAddress[]> {
    return this.model.find({ type, user }).exec();
  }
}
