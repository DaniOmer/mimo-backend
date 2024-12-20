import { Request, Response, NextFunction } from "express";

import { BaseController } from "../../../../librairies/controllers";
import { ApiResponse } from "../../../../librairies/controllers";
import { InventoryService } from "../../domain/inventory/inventory.service";

export class InventoryController extends BaseController {
  readonly inventoryService: InventoryService;

  constructor() {
    super();
    this.inventoryService = new InventoryService();
  }

  async addProductInventory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = req.body;
      const productInventory = await this.inventoryService.addInventory(data);
      ApiResponse.success(
        res,
        "Product inventory added successfully",
        productInventory,
        201
      );
    } catch (error) {
      next(error);
    }
  }

  async updateProductInventory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const inventoryId = req.params.id;
      const data = req.body;
      const updatedInventory = await this.inventoryService.updateInventory(
        inventoryId,
        data
      );
      ApiResponse.success(
        res,
        "Product inventory updated successfully",
        updatedInventory,
        200
      );
    } catch (error) {
      next(error);
    }
  }
}
