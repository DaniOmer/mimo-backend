import { BaseController } from "../../../librairies/controllers";
import { ApiResponse } from "../../../librairies/controllers";
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
      const addressData = req.body;
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
}
