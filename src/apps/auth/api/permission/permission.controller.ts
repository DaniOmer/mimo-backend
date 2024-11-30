import { NextFunction, Request, Response } from "express";
import BaseController from "../../../../librairies/controllers/base.controller";
import PermissionService from "../../domain/permission/permission.service";
import { ApiResponse } from "../../../../librairies/controllers/api.response";
import { PermissionCreateDTO } from "../../domain";

export class PermissionController extends BaseController {
  readonly permissionService: PermissionService;

  constructor() {
    super();
    this.permissionService = new PermissionService();
  }

  async createPermission(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const permissionData = this.dataToDtoInstance(
        req.body,
        PermissionCreateDTO
      );
      const newPermission = await this.permissionService.createPermission(
        permissionData
      );
      ApiResponse.success(
        res,
        "Permission created successfully",
        newPermission,
        201
      );
    } catch (error) {
      next(error);
    }
  }
}