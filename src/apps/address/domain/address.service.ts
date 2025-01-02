import { IAddress } from "../data-access";
import { AddressRepository } from "../data-access";
import { BaseService } from "../../../librairies/services";
import BadRequestError from "../../../config/error/bad.request.config";
import { SecurityUtils, UserDataToJWT } from "../../../utils/security.utils";
import { AddressDTO } from "./address.dto";

export class AddressService extends BaseService {
  private repository: AddressRepository;

  constructor() {
    super("Address");
    this.repository = new AddressRepository();
  }

  async getAddressById(id: string): Promise<IAddress> {
    const address = await this.repository.getById(id);
    if (!address) {
      throw new BadRequestError({
        code: 404,
        message: "Address with the given id not found",
      });
    }
    return address;
  }

  async createAddress(
    address: AddressDTO,
    currentUser: UserDataToJWT
  ): Promise<IAddress> {
    const createdAddress = await this.repository.create({
      user: currentUser.id,
      ...address,
    });
    return createdAddress;
  }

  async updateAddress(
    id: string,
    addressData: AddressDTO,
    currentUser: UserDataToJWT
  ): Promise<IAddress> {
    const existingAddress = await this.getAddressById(id);
    if (!existingAddress) {
      throw new BadRequestError({
        code: 404,
        message: `Address with the given id not found`,
      });
    }
    const addressOwner = existingAddress.user.toString();
    const hasAccess = SecurityUtils.isOwnerOrAdmin(addressOwner, currentUser);
    if (!hasAccess) {
      throw new BadRequestError({
        message: "Unauthorized to update this address",
        logging: true,
        code: 403,
      });
    }

    const updatedAddress = await this.repository.updateById(
      existingAddress._id.toString(),
      addressData
    );
    if (!updatedAddress) {
      throw new BadRequestError({
        code: 404,
        message: `Address with the given id not found`,
      });
    }
    return updatedAddress;
  }

  async getAllAddressesByUserId(userId: string): Promise<IAddress[]> {
    const addresses = await this.repository.getAllAddressesByUserId(userId);
    return addresses;
  }
}
