import { BaseController } from "../../../librairies/controllers";
import { ApiResponse } from "../../../librairies/controllers";
import { AddressDTO } from "../domain";
import { AddressService } from "../domain/address.service";
import { Request, Response, NextFunction } from "express";

export class AddressController extends BaseController {
  readonly addressService: AddressService;

  constructor() {
    super();
    this.addressService = new AddressService();
  }

  async createAddress(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const addressData = req.body;
      const currentUser = req.user;
      const newAddress = await this.addressService.createAddress(
        addressData,
        currentUser
      );
      ApiResponse.success(res, "Address created successfully", newAddress);
    } catch (error) {
      next(error);
    }
  }

  async updateAddress(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const addressId = req.params.id;
      const addressData = this.dataToDtoInstance(req.body, AddressDTO);
      const currentUser = req.user;
      const updatedAddress = await this.addressService.updateAddress(
        addressId,
        addressData,
        currentUser
      );
      ApiResponse.success(res, "Address updated successfully", updatedAddress);
    } catch (error) {
      next(error);
    }
  }

  async deleteAddress(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const addressId = req.params.id;
      const currentUser = req.user;
      await this.addressService.deleteAddress(addressId, currentUser);
      ApiResponse.success(res, "Address deleted successfully", null);
    } catch (error) {
      next(error);
    }
  }

  async getAddressesByUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const currentUser = req.user;
      const addresses = await this.addressService.getAllAddressesByUserId(
        currentUser.id
      );
      ApiResponse.success(res, "Addresses retrieved successfully", addresses);
    } catch (error) {
      next(error);
    }
  }

  async getAddressById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const addressId = req.params.id;
      const currentUser = req.user;
      const address = await this.addressService.getAddressById(
        addressId,
        currentUser
      );
      ApiResponse.success(res, "Address retrieved successfully", address);
    } catch (error) {
      next(error);
    }
  }
}
