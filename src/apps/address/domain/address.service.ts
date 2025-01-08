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

  async getAddressById(
    id: string,
    currentUser: UserDataToJWT
  ): Promise<IAddress> {
    const address = await this.repository.getById(id);

    if (!address) {
      throw new BadRequestError({
        code: 404,
        message: "Address with the given id not found",
      });
    }

    const addressOwner = address.user.toString();
    const hasAccess = SecurityUtils.isOwnerOrAdmin(addressOwner, currentUser);
    if (!hasAccess) {
      throw new BadRequestError({
        message: "Unauthorized to update this address",
        logging: true,
        code: 403,
      });
    }

    return address;
  }

  async createAddress(
    addressData: AddressDTO,
    currentUser: UserDataToJWT
  ): Promise<IAddress> {
    const createdAddress = await this.repository.create({
      user: currentUser.id,
      ...addressData,
    });

    if (createdAddress.isDefault) {
      await this.updateDefaultFlags(
        currentUser.id.toString(),
        createdAddress,
        addressData
      );
    }

    return createdAddress;
  }

  async updateAddress(
    id: string,
    addressData: AddressDTO,
    currentUser: UserDataToJWT
  ): Promise<IAddress> {
    const existingAddress = await this.getAddressById(id, currentUser);
    if (!existingAddress) {
      throw new BadRequestError({
        code: 404,
        message: `Address with the given id not found`,
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

    if (updatedAddress.isDefault) {
      await this.updateDefaultFlags(
        currentUser.id.toString(),
        updatedAddress,
        addressData
      );
    }

    return updatedAddress;
  }

  private async updateDefaultFlags(
    userId: string,
    address: IAddress,
    addressData: AddressDTO
  ): Promise<void> {
    const updateQueries = [];

    if (addressData.isBilling) {
      updateQueries.push(
        this.repository.updateManyAddress(
          {
            user: userId,
            isBilling: true,
            _id: { $ne: address._id },
          },
          { isDefault: false }
        )
      );
    }

    if (addressData.isShipping) {
      updateQueries.push(
        this.repository.updateManyAddress(
          {
            user: userId,
            isShipping: true,
            _id: { $ne: address._id },
          },
          { isDefault: false }
        )
      );
    }

    await Promise.all(updateQueries);
  }

  async getAllAddressesByUserId(userId: string): Promise<IAddress[]> {
    const addresses = await this.repository.getAllAddressesByUserId(userId);
    return addresses;
  }

  async deleteAddress(id: string, currentUser: UserDataToJWT): Promise<void> {
    const existingAddress = await this.repository.getById(id);
    if (!existingAddress) {
      throw new BadRequestError({
        message: "User address not found",
        logging: true,
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
    await this.repository.deleteById(existingAddress._id);
  }
}
