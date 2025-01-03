import { MongooseRepository } from "../../../librairies/repositories";
import { IAddress } from "./address.interface";
import { AddressModel } from "./address.model";

export class AddressRepository extends MongooseRepository<IAddress> {
  constructor() {
    super(AddressModel);
  }

  async getAllAddressesByUserId(userId: string): Promise<IAddress[]> {
    const addresses = await this.model
      .find({ user: userId })
      .sort({ createdAt: -1 });
    return addresses;
  }

  async updateManyAddress(
    filter: Record<string, any>,
    update: Partial<IAddress>
  ): Promise<void> {
    await this.model.updateMany(filter, update).exec();
  }
}
